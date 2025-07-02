import * as path from 'path'
import { DataSource } from 'typeorm'
import 'tsconfig-paths/register'
import 'dotenv/config'

const SEED_MODE = process.env.SEED_MODE === 'true'

const migrationsOrSeedersFolderName = SEED_MODE ? 'seeders' : 'migrations'

const entities = [path.join(process.cwd(), 'src', 'modules/**/entities/*.entity{.ts,.js}')]
const migrations = [path.join(__dirname, migrationsOrSeedersFolderName, '*{.ts,.js}')]

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: process.env.POSTGRES_DATABASE,
  entities,
  migrations,
  logging: process.env.POSTGRES_LOGGING === 'true',
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
  dropSchema: process.env.POSTGRES_DROP_SCHEMA === 'true'
})
