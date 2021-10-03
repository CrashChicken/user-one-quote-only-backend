import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const databaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: '192.168.2.10',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: ['dist/src/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default databaseConfig;
