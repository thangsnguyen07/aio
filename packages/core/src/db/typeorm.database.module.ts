import { DynamicModule, Module } from '@nestjs/common'

import { DataSourceOptions } from 'typeorm'

import { TypeORMDatabaseProvider } from './typeorm.database.provider'

@Module({})
export class TypeORMDatabaseModule {
  static register(dataSourceOptions: DataSourceOptions): DynamicModule {
    return {
      module: TypeORMDatabaseModule,
      providers: [
        {
          provide: 'TYPEORM_DATASOURCE_OPTIONS',
          useValue: dataSourceOptions,
        },
        TypeORMDatabaseProvider,
      ],
      exports: [TypeORMDatabaseProvider],
    }
  }
}
