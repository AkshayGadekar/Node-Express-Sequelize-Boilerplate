import { sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from './../config/sequelize'

class Token extends Model <InferAttributes<Token>, InferCreationAttributes<Token>> {
    declare id: CreationOptional<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare user_id: number
    declare secret: string
    declare expire_in: number
    declare type: 'access_token' | 'refresh_token'
}

Token.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expire_in: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('access_token', 'refresh_token'),
        allowNull: false,
        defaultValue: 'access_token'
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens'
})

export default Token
