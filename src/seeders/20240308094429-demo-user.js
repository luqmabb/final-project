'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
      name: "luqmab",
      email: "luqmabb46@example.com",
      password: "12345678",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "yanto",
      email: "yanto89@example.com",
      password: "yantogantenk",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "putin",
      email: "putinremix@example.com",
      password: "putinselalu",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
