import { z } from 'zod'

export const RegisterSchema = z.object({
    name: z.string({ required_error: 'name is required.' }).min(2, 'name must be of at least 2 characters.').max(50, 'name must be of maximum 50 characters.'),
    email: z.string({ required_error: 'email is required.' }).email({ message: 'email must be a valid email.' }),
    password: z.string({ required_error: 'password is required.' }).min(5, 'password must be of at least 5 characters.').max(40, 'password must be of maximum 40 characters.').regex(new RegExp("^(?=.*[1-9\W])(?=.*[a-zA-Z]).+$"), 'password must contain letters with at least one number or symbol.')
})

export const LoginSchema = z.object({
    email: z.string({ required_error: 'email is required.' }).email({ message: 'email must be a valid email.' }),
    password: z.string({ required_error: 'password is required.' }).min(5, 'password must be of at least 5 characters.').max(40, 'password must be of maximum 40 characters.')
})

export const TokenSchema = z.object({
    refresh_token: z.string({ required_error: 'Refesh token is required.' })
})