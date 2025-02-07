'use strict';
const addDays = require('date-fns/addDays')
const format = require('date-fns/format')

const tableName = 'conciliations'

const content = () => {
  let result = [],
      start = new Date(2019, 0, 1);

  for (var i = 0; i < (400*3); i++) {
    let current = addDays(start, i),
        day = format(current, 'yyyy-MM-dd'),
        content = {
            date: day,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    result.push(content)
  }

  return result;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content(), {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
