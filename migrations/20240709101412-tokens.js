'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expire_in: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('access_token', 'refresh_token'),
        allowNull: false,
        defaultValue: 'access_token'
      },
      // revoked: {
      //   type: Sequelize.BOOLEAN,
      //   allowNull: false
      // },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
    await queryInterface.addIndex('tokens', ['secret'])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tokens')
    //await queryInterface.removeIndex('tokens', ['secret'])
  }
}
