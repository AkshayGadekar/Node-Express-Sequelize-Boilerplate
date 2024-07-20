import { Sequelize, Options } from "sequelize"

const dbInfo: Options = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
}

const sequelize = new Sequelize(dbInfo)

export * from "sequelize"
export { sequelize }

