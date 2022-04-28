import { Controller, Post } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { GetClientService } from '../../../application/client/find';

@Controller('editor')
export class EditorController {
  constructor(private readonly getClientService: GetClientService) {}

  @Post('paginate/clients')
  async paginateClients(query: PaginateQuery) {
    return this.getClientService.paginate(query);
  }

  //   @Delete('delete/client')
  //   async deleteClient()
}
