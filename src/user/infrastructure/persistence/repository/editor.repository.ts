import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { EditorEntity } from '../entity/editor.entity';

@Injectable()
@EntityRepository(EditorEntity)
export class EditorRepository extends Repository<EditorEntity> {}
