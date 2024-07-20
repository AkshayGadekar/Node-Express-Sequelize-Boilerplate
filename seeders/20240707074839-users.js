'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {})
    */
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@xyz.com',
        password: '$2a$10$Wq4nsEvWqCM.wR1eVIhIfO2sUZVee/yyzHwYKEmim5ojOZf80jIzG', // Admin@123
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@xyz.com' }, {})
  }
}
