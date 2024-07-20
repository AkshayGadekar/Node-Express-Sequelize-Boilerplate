import { sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from './../config/sequelize'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { encrypt, randomString, getTokenPayload } from '../utils'
import { jwt_secret, jwt_expire_access_token, jwt_expire_refresh_token } from '../config'
import Token from './Token'

class User extends Model <InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare name: string
    declare email: string
    declare password: string

    public matchPassword = async (enteredPassword: string) =>
    await bcrypt.compare(enteredPassword, this.get('password'))

    public getSecret = async () => {
        let secret: string
        while (true) {
            secret = randomString(8)
            const doesSecretExist = await Token.count({ where: { secret } })
            if (!doesSecretExist) break
        }
        return secret
    }

    public generateTokens = async () => {
        const user_id = this.get('id')
        const data = encrypt(String(user_id))
        const secret: string = await this.getSecret()

        const access_token = jwt.sign({ data, secret, type: 'access_token' }, jwt_secret, {
            expiresIn: jwt_expire_access_token
        })
        const refresh_token = jwt.sign({ data, secret, type: 'refresh_token' }, jwt_secret, {
            expiresIn: jwt_expire_refresh_token
        })

        const access_token_expires_in = (getTokenPayload(access_token) as jwt.JwtPayload).exp!
        const refresh_token_expires_in = (getTokenPayload(refresh_token) as jwt.JwtPayload).exp!
        
        Token.bulkCreate([
            { user_id, secret, type: 'access_token', expire_in: access_token_expires_in },
            { user_id, secret, type: 'refresh_token', expire_in: refresh_token_expires_in }
        ])

        return { access_token, refresh_token }
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
        beforeSave: async (user) => {
            const password = user.password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
        }
    }
})

export default User
