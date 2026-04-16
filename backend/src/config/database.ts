import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
  },
});

export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected.');
  } catch (err) {
    console.error('Unable to connect to PostgreSQL:', err);
    throw err;
  }
}
