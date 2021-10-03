import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const databaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/src/migrations/*.{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default databaseConfig;
