import express from 'express'
import { RegisterSchema, LoginSchema, TokenSchema } from './../validations'
import { auth } from '../middlewares'
import { validate } from '../middlewares'
import { register, login, logout, generateToken, authUser } from './../controllers/auth'

const router = express.Router()

router.post('/register', validate(RegisterSchema), register)
router.post('/login', validate(LoginSchema), login)
router.post('/token', validate(TokenSchema), generateToken)
router.get('/logout', logout)
router.get('/', auth, authUser)

export default router
