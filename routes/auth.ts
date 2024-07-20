import express from 'express'
import auth from './../middleware/auth'
import { register, login, logout, generateToken, authUser } from './../controllers/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post('/token', generateToken)
router.get('/', auth, authUser)

export default router
