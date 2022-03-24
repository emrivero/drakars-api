import { mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from '../domain/entities/user';
import { UserKeycloakEntity } from '../infrastructure/idp/keycloak/entities/user.keycloak.entity';
import { CreateUserDto } from '../infrastructure/rest/dtos/create-user.dto';
import { UpdateUserDto } from '../infrastructure/rest/dtos/update-user-dto';
import { UserVm } from '../infrastructure/rest/vms/user.vm';

@Injectable()
export class UserMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(User, UserKeycloakEntity).forMember(
        (destination) => destination.attributes,
        mapFrom((source) => {
          const rol = source?.attributes?.rol;
          return {
            rol,
          };
        }),
      );
      mapper.createMap(UserKeycloakEntity, User).forMember(
        (destination) => destination.attributes,
        mapFrom((source) => {
          const rol = source?.attributes?.rol;
          return {
            rol,
          };
        }),
      );
      mapper.createMap(User, UserVm).forMember(
        (destination) => destination.attributes,
        mapFrom((source) => {
          const rol = source?.attributes?.rol;
          const firstRol = Array.isArray(rol) ? rol[0] : rol;
          return {
            rol: firstRol,
          };
        }),
      );
      mapper.createMap(CreateUserDto, User);
      mapper.createMap(UpdateUserDto, User);
    };
  }
}
