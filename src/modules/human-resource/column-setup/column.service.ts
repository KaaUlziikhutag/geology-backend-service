import { Injectable } from '@nestjs/common';
import humanColumns from './human.json';
import workerColumns from './worker.json';
import { EntityManager, EntityTarget } from 'typeorm';

@Injectable()
export class ColumnService {
  private columns: Record<string, string>;

  constructor() {
    this.columns = { ...humanColumns, ...workerColumns };
  }

  async translate(column: string): Promise<string> {
    return this.columns[column] || column;
  }

  private determineIfExam(column: string): boolean {
    const examFields = ['firstName', 'lastName'];

    return examFields.includes(column);
  }

  public isExamField(column: string): boolean {
    return this.determineIfExam(column);
  }

  async getAllColumns<Entity>(
    entity: EntityTarget<Entity>,
    entityManager: EntityManager,
  ) {
    const metadata = entityManager.connection.getMetadata(entity);
    const excludedColumns = [
      'createdAt',
      'updatedAt',
      'deletedAt',
      'id',
      'dbKey',
      'userId',
      'humanId',
      'profileId',
      'companyId',
      'workers',
      'isHideMobile',
      'codeOut',
      'isEditDate',
      'isRequest',
      'isModerator',
      'workerTip',
      'timeStepId',
      'timeAccessMode',
      'timeAccessType',
      'timeAccessId',
      'ergonomist',
      'codeOut',
      'position',
      'server',
      'dbKey',
    ];
    return metadata.columns
      .map((column) => column.propertyName)
      .filter((columnName) => !excludedColumns.includes(columnName));
  }
}
