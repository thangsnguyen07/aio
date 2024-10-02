import { config } from 'dotenv'
import { get } from 'env-var'
import { DataSource, DataSourceOptions } from 'typeorm'

config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  logging: get('DB_LOGGING').default('false').asBool(),
  host: get('DB_HOST').required().asString(),
  port: get('DB_PORT').required().asIntPositive(),
  username: get('DB_USERNAME').required().asString(),
  password: get('DB_PASSWORD').required().asString(),
  database: get('DB_NAME').required().asString(),
  synchronize: get('DB_SYNCHRONIZE').required().asBool(),
  schema: 'user',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/infrastructure/database/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
