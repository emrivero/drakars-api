import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { KeycloakAdminConfigService } from '../../../../../config/keycloak-admin/config.service';
import { UserModel } from '../../../../domain/interface/user.model';
import { UserKeycloakEntity } from '../entities/user.keycloak.entity';
import { KeycloakConnector } from '../keycloak-connector';

@Injectable()
export class KeycloakRepository {
  private readonly SUPERADMIN_USER: UserKeycloakEntity = null;

  constructor(
    private readonly kcConnector: KeycloakConnector,
    private readonly kcConfig: KeycloakAdminConfigService,
  ) {}

  private async getKcClient(): Promise<KeycloakAdminClient> {
    return await this.kcConnector.getkcClient();
  }

  private throwHttpException(e: any) {
    const { response } = e;
    if (response && response.data && response.status) {
      throw new HttpException(response.data, response.status);
    }

    throw e;
  }

  private excludeUser(user: UserKeycloakEntity) {
    if (user.username === this.kcConfig.clientAdminUser) {
      throw new ForbiddenException();
    }
  }

  private async getClientUUId(): Promise<string> {
    try {
      const client = await this.getKcClient();
      const clients = await client.clients.find({
        clientId: this.kcConfig.clientID,
      });

      if (clients.length > 0 && clients[0].id) {
        return clients[0].id;
      }
      return null;
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  private async findRole(roleName: string): Promise<RoleRepresentation> {
    try {
      const client = await this.getKcClient();
      const clientUUId = await this.getClientUUId();

      if (clientUUId) {
        return await client.clients.findRole({
          id: clientUUId,
          roleName,
        });
      }
    } catch (e) {
      this.throwHttpException(e);
    }
    return null;
  }

  private async removeAllRoles(id: string, clientUUId: string) {
    try {
      const client = await this.getKcClient();

      const allRoles = await client.users.listClientRoleMappings({
        id,
        clientUniqueId: clientUUId,
      });

      await client.users.delClientRoleMappings({
        id,
        clientUniqueId: clientUUId,
        roles: allRoles.map((rol) => ({ id: rol.id, name: rol.name })),
      });
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  private async setRole(id: string, user: UserModel) {
    try {
      const client = await this.getKcClient();

      const clientUUId = await this.getClientUUId();
      const role = await this.findRole(user.role);

      if (!role) {
        throw new BadRequestException({
          error: 'Bad Request',
          message: `Role ${role} does not exist.`,
          statusCode: 400,
        });
      }

      this.removeAllRoles(id, clientUUId);

      await client.users.addClientRoleMappings({
        id,
        clientUniqueId: clientUUId,
        roles: [
          {
            id: role.id,
            name: role.name,
          },
        ],
      });
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  async createUser(user: UserModel) {
    const client = await this.getKcClient();
    try {
      const { id } = await client.users.create({
        username: user.email,
        email: user.email,
        lastName: user.family_name,
        firstName: user.name,
        enabled: true,
        requiredActions: [RequiredActionAlias.UPDATE_PASSWORD],
        credentials: [
          {
            temporary: false,
            type: 'password',
            value: user.password,
          },
        ],
        attributes: {
          rol: user.role,
        },
      });

      await this.setRole(id, user);

      return await this.getUser(id);
    } catch (e) {
      // remove user if something went wrong
      const users = await client.users.find({
        username: user.email,
      });

      if (users.length > 0) {
        this.deleteUser(users[0].id);
      }

      this.throwHttpException(e);
    }
  }

  async deleteUser(id: string) {
    try {
      const client = await this.getKcClient();
      const user = await this.getUser(id);

      await client.users.del({ id });

      return await user;
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  async getUser(id: string) {
    try {
      const client = await this.getKcClient();

      const user = await client.users.findOne({ id });
      this.excludeUser(user);

      return user;
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  async getUsers() {
    try {
      const client = await this.getKcClient();

      // exclude superadmin
      const users: UserKeycloakEntity[] = await (
        await client.users.find()
      ).filter((user) => user.username !== this.kcConfig.clientAdminUser);

      return users;
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  async updateUser(id: string, user: UserModel) {
    try {
      const client = await this.getKcClient();

      await client.users.update(
        { id },
        {
          username: user.email,
          email: user.email,
          lastName: user.family_name,
          firstName: user.name,
          enabled: true,
          attributes: {
            rol: user.role,
          },
        },
      );

      await this.setRole(id, user);

      return this.getUser(id);
    } catch (e) {
      this.throwHttpException(e);
    }
  }
}
