'use strict';
const addDays = require('date-fns/addDays')
const format = require('date-fns/format')
const getYear = require('date-fns/getYear')
const lastDayOfMonth = require('date-fns/lastDayOfMonth')
const ptBr = require('date-fns/locale/pt-BR');

const tableName = 'dateDimensions'

const getHoliday = (date) => {
  const holidays = ['01-01','04-21','05-01','09-07','10-12','11-02','11-15','12-25'],
        findDate = date.substr(5, 5)
  if (holidays.includes(findDate) == true) {
    return true;
  }
  return false;
}

const content = () => {
  let result = [],
      start = new Date(2000, 0, 1);

  for (var i = 0; i < (365*101); i++) {
    let current = addDays(start, i),
        year = getYear(current),
        check = String(year) + '-07-01',
        semester = (format(current, 'yyyy-MM-dd') < check ? (String(year) + '-01') : (String(year) + '-02')),
        day = format(current, 'yyyy-MM-dd'),
        content = {
            day: day,
            month: format(current, 'yyyy-MM'), 
            year: format(current, 'yyyy'), 
            week: format(current, 'yyyy-II'),
            quarter: format(current, 'yyyy-QQ'),
            semester: semester,
            dayOfYear: format(current, 'DDD'),
            lastDayOfMonth: format(lastDayOfMonth(current), 'yyyy-MM-dd'),
            weekDay: format(current, 'i'),
            weekDayName: format(current, 'eeee', { locale: ptBr }),
            abbrMonth: format(current, 'MMM', { locale: ptBr }),
            wideMonth: format(current, 'MMMM', { locale: ptBr }),
            isHoliday: getHoliday(day)
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
