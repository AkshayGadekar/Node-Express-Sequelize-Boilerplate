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
Run the migrations and seed:
```bash
npm run migrate
npm run seed
```
Start the server:
```bash
npm run dev
```
    