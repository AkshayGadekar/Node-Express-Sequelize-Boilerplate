# Node-Express-Sequelize-Boilerplate
Start building your next project on top of this boilerplate. A starter project for quickly building RESTful APIs using Node.js, Express, and Sequelize.

## Quick Start
To install the project, follow these steps.
Clone the repo:

```bash
git clone https://github.com/AkshayGadekar/Node-Express-Sequelize-Boilerplate.git
cd Node-Express-Sequelize-Boilerplate
```
if you are using NVM, switch to latest node version:
```bash
nvm use
```
Install the dependencies:

```bash
npm install
```
Set the environment variables:

```bash
cp .env.example .env

# open .env and add your database credentials
```
Run the migrations and seed (creates a default user as email: `admin@xyz.com`, password: `Admin@123`):
```bash
npm run migrate
npm run seed
```
Start the server:
```bash
npm run dev
```

## Features
- **MySQL database**: [Sequelize](https://sequelize.org/docs/v6/) Models and Migrations to talk with the database
- **Authentication**: Full to User Authentication using [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken). Separate table to handle access and refresh tokens.
- **Validation**: request data validation using Zod. One can configure if [Zod](https://zod.dev/) should show single error or multiple errors for each field.
- **Error handling**: centralized error handling mechanism
- **Environment variables**: using [Dotenv](https://www.npmjs.com/package/dotenv)
- **Security**: set security HTTP headers using [Helmet](https://www.npmjs.com/package/helmet). Prevent http param pollution using [HPP](https://www.npmjs.com/package/hpp).
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://www.npmjs.com/package/cors)
- **Cookies**: configured http cookies to use jwt tokens.
- **Migrations-Seeds**: Set up shortcut commands related to migrations and seeds

## Commands
Migrations:
```bash
# Make migration for e.g. persons table
npm run make:migration -- --name persons

# Run the migration
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Rollback till particular migration e.g. XXXXXXXXXXXXXX-users.js
npm run migrate:reset -- --to XXXXXXXXXXXXXX-users.js

# Rollback all the migrations
npm run migrate:reset
```
Seeds:
```bash
# Make seed for e.g. persons table
npm run make:seed -- --name person

# Run the seed
npm run seed

# Rollback the last seed 
npm run seed:rollback

# Rollback till particular seed e.g. XXXXXXXXXXXXXX-users.js
npm run seed:rollback -- --seed XXXXXXXXXXXXXX-users.js

# Rollback all the seeds
npm run seed:reset

```
**Note**: sequelize-cli generates migrations and seeds as JS files not TS files. After creating migration, we recommend you to create a respective model as TS file manually.
To know more about migrations and seeds refer [sequelize-cli](https://sequelize.org/docs/v6/other-topics/migrations/).

## Modifications
To do changes in Users table run:
```bash
npm run migrate:reset
```
This will rollback the Tokens and then Users table. One can do changes in User migration file now and its related User model. Then run:
```bash
npm run migrate
``` 
Make sure to do same changes for register API at AuthController and at users seed too.

## Environment Variables
The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
NODE_SERVER_PORT=5000

# PREFIX for all APIs URI
API_PREFIX=/api/v1

# Validation errors for each field should be shown as single or multiple
SHOW_SINGLE_VALIDATION_ERROR_FOR_EACH_FIELD=true

# Validation error message 
VALIDATION_MESSAGE=Validation Errors

# Encrypt/Decrypt data using Cipher
ENCRYPTION_ALGORITHM=aes-256-cbc
ENCRYPTION_KEY=b75g9hty46QM0yhODcCb1lrUtVVH4g6t
INITIALIZATION_VECTOR=X05IGQ5qdBnIqAWD

# JWT
# JWT secret key
JWT_SECRET=kl7sd7g89ifhgjfkdnfdf
# Number of days after which an access token expires
JWT_EXPIRE_ACCESS_TOKEN_IN_DAYS=5
# Number of days after which a refresh token expires
JWT_EXPIRE_REFRESH_TOKEN_IN_DAYS=7

# Should HTTP cookie be enabled
COOKIE_ENABLED=false

# Rate Limit
# How long to remember requests for, in minutes
RATE_LIMIT_MAX_MINUTES=10
# How many requests to allow
RATE_LIMIT_MAX_REQUESTS=100

# Database credentials
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=database
MYSQL_USERNAME=root
MYSQL_PASSWORD=password
```

## Project Structure
```
 |--@types\         # Type declarations
 |--config\         # configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom middlewares
 |--migrations\     # Table migrations
 |--models\         # Table models (data layer)
 |--public\         # Static folder for files
 |--routes\         # Routes
 |--seeders\        # Seeders
 |--utils\          # Utility classes and functions
 |--.env            # Environment variables
 |--index.ts        # App entry point
```

## API Endpoints
**Auth routes**:\
`POST /api/v1/auth/register` - register\
`POST /api/v1/auth/login` - login\
`POST /api/v1/auth/token` - refresh auth tokens\
`GET /api/v1/auth/logout` - logout\
`GET /api/v1/auth` - Auth User details

To require authentication for certain routes, you can use the `middlewares/auth.ts` middleware.

## Error Handling
The app has a centralized error handling mechanism.

If function is async, wrap it with with `middlewares/async.ts` middleware to catch the errors into `middlewares/error.ts`. `middlewares/error.ts` errorHandler cathes errors thrown using `utils/ErrorResponse` class or `next(Error)`
```bash
import Error from './../utils/errorResponse'

# throw error
throw new Error({ message: 'User not found.' }, 404)

# or use Next function
return next(new Error({ message: 'User not found.' }, 404))
```
`ErrorResponse` object accepts the following interface:
```bash
{
    message?: string,
    data?: any
},
statusCode?: number
```
`Success` also have same interface:
```bash
import { success } from '../utils'

return success(res, { data: user, message: 'User found.' }, 200)
```

## Contribution

You can contribute to this project by discovering bugs and opening issues. Please, add to which version of package you create pull request or issue. (e.g. [1.0.0] Fatal error on `ErrorResponse` method)
