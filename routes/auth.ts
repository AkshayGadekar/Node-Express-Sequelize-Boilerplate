import express from 'express'
import auth from '../middlewares/auth'
import { register, login, logout, generateToken, authUser } from './../controllers/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/token', generateToken)
router.get('/logout', logout)
router.get('/', auth, authUser)

export default router
