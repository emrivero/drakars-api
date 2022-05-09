import { ServiceUnavailableException } from '@nestjs/common';
import { mapKeys, values } from 'lodash';
import { stringify } from 'querystring';
import {
  Between,
  Brackets,
  Equal,
  FindConditions,
  FindOperator,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { WherePredicateOperator } from 'typeorm/query-builder/WhereClause';
import { PaginateQuery } from './decorator';
import { Column, DeepRelations, Order, RelationColumn, SortBy } from './helper';

const QUERY_INFIX = '__';

export class Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: SortBy<T>;
    searchBy: Column<T>[];
    search: string;
    filter?: { [column: string]: string | string[] };
  };
  links: {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
  };
}

export interface PaginateConfig<T> {
  deepRelations?: DeepRelations<T>[];
  relations?: RelationColumn<T>[];
  sortableColumns: Column<T>[];
  searchableColumns?: Column<T>[];
  maxLimit?: number;
  defaultSortBy?: SortBy<T>;
  defaultLimit?: number;
  where?: FindConditions<T> | FindConditions<T>[];
  filterableColumns?: { [key in Column<T>]?: FilterOperator[] };
}

export enum FilterOperator {
  EQ = '$eq',
  GT = '$gt',
  GTE = '$gte',
  IN = '$in',
  NULL = '$null',
  LT = '$lt',
  LTE = '$lte',
  BTW = '$btw',
  NOT = '$not',
}

export function isOperator(value: unknown): value is FilterOperator {
  return values(FilterOperator).includes(value as any);
}

export function createRecursiveJoin<T>(
  queryBuilder: SelectQueryBuilder<T>,
  deepRelations: DeepRelations<T>,
  aliasPrefix = queryBuilder.alias,
): void {
  if (typeof deepRelations === 'string') {
    queryBuilder.leftJoinAndSelect(
      `${aliasPrefix}.${deepRelations}`,
      `${aliasPrefix}${QUERY_INFIX}${deepRelations}`,
    );
    return;
  }
  for (const key in deepRelations) {
    queryBuilder.leftJoinAndSelect(
      `${aliasPrefix}.${key}`,
      `${aliasPrefix}${QUERY_INFIX}${key}`,
    );
    createRecursiveJoin(
      queryBuilder,
      deepRelations[key],
      `${aliasPrefix}${QUERY_INFIX}${key}`,
    );
  }
}

export const OperatorSymbolToFunction = new Map<
  FilterOperator,
  (...args: any[]) => FindOperator<string>
>([
  [FilterOperator.EQ, Equal],
  [FilterOperator.GT, MoreThan],
  [FilterOperator.GTE, MoreThanOrEqual],
  [FilterOperator.IN, In],
  [FilterOperator.NULL, IsNull],
  [FilterOperator.LT, LessThan],
  [FilterOperator.LTE, LessThanOrEqual],
  [FilterOperator.BTW, Between],
  [FilterOperator.NOT, Not],
]);

export function getFilterTokens(raw: string): string[] {
  const tokens = [];
  const matches = raw.match(/(\$\w+):/g);

  if (matches) {
    const value = raw.replace(matches.join(''), '');
    tokens.push(
      ...matches.map((token) => token.substring(0, token.length - 1)),
      value,
    );
  } else {
    tokens.push(raw);
  }

  if (tokens.length === 0 || tokens.length > 3) {
    return [];
  } else if (tokens.length === 2) {
    if (tokens[1] !== FilterOperator.NULL) {
      tokens.unshift(null);
    }
  } else if (tokens.length === 1) {
    if (tokens[0] === FilterOperator.NULL) {
      tokens.unshift(null);
    } else {
      tokens.unshift(null, FilterOperator.EQ);
    }
  }

  return tokens;
}

function parseFilter<T>(query: PaginateQuery, config: PaginateConfig<T>) {
  const filter: { [columnName: string]: FindOperator<string> } = {};
  for (const column of Object.keys(query.filter)) {
    if (!(column in config.filterableColumns)) {
      continue;
    }
    const allowedOperators = config.filterableColumns[column];
    const input = query.filter[column];
    const statements = !Array.isArray(input) ? [input] : input;
    for (const raw of statements) {
      const tokens = getFilterTokens(raw);
      if (tokens.length === 0) {
        continue;
      }
      const [op2, op1, value] = tokens;

      if (!isOperator(op1) || !allowedOperators.includes(op1)) {
        continue;
      }
      if (isOperator(op2) && !allowedOperators.includes(op2)) {
        continue;
      }
      if (isOperator(op1)) {
        switch (op1) {
          case FilterOperator.BTW:
            filter[column] = OperatorSymbolToFunction.get(op1)(
              ...value.split(','),
            );
            break;
          case FilterOperator.IN:
            filter[column] = OperatorSymbolToFunction.get(op1)(
              value.split(','),
            );
            break;
          default:
            filter[column] = OperatorSymbolToFunction.get(op1)(value);
            break;
        }
      }
      if (isOperator(op2)) {
        filter[column] = OperatorSymbolToFunction.get(op2)(filter[column]);
      }
    }
  }
  return filter;
}

export async function paginate<T>(
  query: PaginateQuery,
  repo: Repository<T> | SelectQueryBuilder<T>,
  config: PaginateConfig<T>,
): Promise<Paginated<T>> {
  let page = query.page || 1;
  const limit = Math.min(
    query.limit || config.defaultLimit || 20,
    config.maxLimit || 100,
  );
  const sortBy = [] as SortBy<T>;
  const searchBy: Column<T>[] = [];
  const path = query.path;

  function isEntityKey(
    entityColumns: Column<T>[],
    column: string,
  ): column is Column<T> {
    return !!entityColumns.find((c) => c === column);
  }

  if (config.sortableColumns.length < 1)
    throw new ServiceUnavailableException();

  if (query.sortBy) {
    for (const order of query.sortBy) {
      if (
        isEntityKey(config.sortableColumns, order[0]) &&
        ['ASC', 'DESC'].includes(order[1])
      ) {
        sortBy.push(order as Order<T>);
      }
    }
  }

  if (!sortBy.length) {
    sortBy.push(
      ...(config.defaultSortBy || [[config.sortableColumns[0], 'ASC']]),
    );
  }

  if (config.searchableColumns) {
    if (query.searchBy) {
      for (const column of query.searchBy) {
        if (isEntityKey(config.searchableColumns, column)) {
          searchBy.push(column);
        }
      }
    } else {
      searchBy.push(...config.searchableColumns);
    }
  }

  if (page < 1) page = 1;

  let [items, totalItems]: [T[], number] = [[], 0];

  let queryBuilder: SelectQueryBuilder<T>;

  if (repo instanceof Repository) {
    queryBuilder = repo
      .createQueryBuilder('e')
      .take(limit)
      .skip((page - 1) * limit);
  } else {
    queryBuilder = repo.take(limit).skip((page - 1) * limit);
  }

  if (config.relations?.length) {
    config.relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(
        `${queryBuilder.alias}.${relation}`,
        `${queryBuilder.alias}${QUERY_INFIX}${relation}`,
      );
    });
  }

  if (config.deepRelations?.length) {
    config.deepRelations.forEach((deepRelation) =>
      createRecursiveJoin<T>(queryBuilder, deepRelation),
    );
  }

  for (const order of sortBy) {
    if (order[0].split('.').length > 1) {
      queryBuilder.addOrderBy(
        `${queryBuilder.alias}${QUERY_INFIX}${order[0]}`,
        order[1],
      );
    } else {
      queryBuilder.addOrderBy(`${queryBuilder.alias}.${order[0]}`, order[1]);
    }
  }

  if (config.where) {
    queryBuilder.andWhere(new Brackets((qb) => qb.andWhere(config.where)));
  }

  if (query.search && searchBy.length) {
    queryBuilder.andWhere(
      new Brackets((qb: SelectQueryBuilder<T>) => {
        for (const column of searchBy) {
          const property = column.replace(/[.](?=.*[.])/g, QUERY_INFIX);

          const propertyPath = (column as string).split('.');
          if (propertyPath.length > 1) {
            const condition: WherePredicateOperator = {
              operator: 'ilike',
              parameters: [
                `${qb.alias}${QUERY_INFIX}${property}`,
                `:${column}`,
              ],
            };
            qb.orWhere(qb['createWhereConditionExpression'](condition), {
              [column]: `%${query.search}%`,
            });
          } else {
            qb.orWhere({
              [column]: ILike(`%${query.search}%`),
            });
          }
        }
      }),
    );
  }

  if (query.filter) {
    const filter = parseFilter(query, config);
    queryBuilder.andWhere(
      new Brackets((qb: SelectQueryBuilder<T>) => {
        for (const column in filter) {
          const propertyPath = (column as string).split('.');
          if (propertyPath.length > 1) {
            const condition = qb['getWherePredicateCondition'](
              column,
              filter[column],
            ) as WherePredicateOperator;
            let parameters = { [column]: filter[column].value };
            // TODO: refactor below
            switch (condition.operator) {
              case 'between':
                condition.parameters = [
                  `${qb.alias}${QUERY_INFIX}${column}`,
                  `:${column}${QUERY_INFIX}from`,
                  `:${column}${QUERY_INFIX}to`,
                ];
                parameters = {
                  [column + `${QUERY_INFIX}from`]: filter[column].value[0],
                  [column + `${QUERY_INFIX}to`]: filter[column].value[1],
                };
                break;
              case 'in':
                condition.parameters = [
                  `${qb.alias}${QUERY_INFIX}${column}`,
                  `:...${column}`,
                ];
                break;
              default:
                condition.parameters = [
                  `${qb.alias}${QUERY_INFIX}${column}`,
                  `:${column}`,
                ];
                break;
            }
            qb.andWhere(
              qb['createWhereConditionExpression'](condition),
              parameters,
            );
          } else {
            qb.andWhere({
              [column]: filter[column],
            });
          }
        }
      }),
    );
  }

  [items, totalItems] = await queryBuilder.getManyAndCount();

  let totalPages = totalItems / limit;
  if (totalItems % limit) totalPages = Math.ceil(totalPages);

  const sortByQuery = sortBy
    .map((order) => `&sortBy=${order.join(':')}`)
    .join('');
  const searchQuery = query.search ? `&search=${query.search}` : '';

  const searchByQuery =
    query.searchBy && searchBy.length
      ? searchBy.map((column) => `&searchBy=${column}`).join('')
      : '';

  const filterQuery = query.filter
    ? '&' +
      stringify(
        mapKeys(query.filter, (_param, name) => 'filter.' + name),
        '&',
        '=',
        { encodeURIComponent: (str) => str },
      )
    : '';

  const options = `&limit=${limit}${sortByQuery}${searchQuery}${searchByQuery}${filterQuery}`;

  const buildLink = (p: number): string => path + '?page=' + p + options;

  const results: Paginated<T> = {
    data: items,
    meta: {
      itemsPerPage: limit,
      totalItems,
      currentPage: page,
      totalPages: totalPages,
      sortBy,
      search: query.search,
      searchBy: query.search ? searchBy : undefined,
      filter: query.filter,
    },
    links: {
      first: page == 1 ? undefined : buildLink(1),
      previous: page - 1 < 1 ? undefined : buildLink(page - 1),
      current: buildLink(page),
      next: page + 1 > totalPages ? undefined : buildLink(page + 1),
      last:
        page == totalPages || !totalItems ? undefined : buildLink(totalPages),
    },
  };

  return Object.assign(new Paginated<T>(), results);
}
