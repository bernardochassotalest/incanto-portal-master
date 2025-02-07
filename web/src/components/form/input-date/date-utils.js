import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import endOfDay from 'date-fns/endOfDay';
import endOfWeek from 'date-fns/endOfWeek';
import endOfYear from 'date-fns/endOfYear';
import format from 'date-fns/format';
import getHours from 'date-fns/getHours';
import getSeconds from 'date-fns/getSeconds';
import getYear from 'date-fns/getYear';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import isSameDay from 'date-fns/isSameDay';
import isSameYear from 'date-fns/isSameYear';
import isSameMonth from 'date-fns/isSameMonth';
import isSameHour from 'date-fns/isSameHour';
import isValid from 'date-fns/isValid';
import parseFns from 'date-fns/parse';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setMonth from 'date-fns/setMonth';
import setSeconds from 'date-fns/setSeconds';
import setYear from 'date-fns/setYear';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import startOfYear from 'date-fns/startOfYear';

export default class DateFnsUtils {
  constructor({ locale } = {}) {
      this.yearFormat = 'yyyy';
      this.yearMonthFormat = 'MMMM yyyy';
      this.dateTime12hFormat = 'MMMM do hh:mm aaaa';
      this.dateTime24hFormat = 'MMMM do HH:mm';
      this.time12hFormat = 'hh:mm a';
      this.time24hFormat = 'HH:mm';
      this.dateFormat = 'MMMM do';
      this.locale = locale;
  }
  // Note: date-fns input types are more lenient than this adapter, so we need to expose our more
  // strict signature and delegate to the more lenient signature. Otherwise, we have downstream type errors upon usage.
  addDays(value, count) {
      return addDays(value, count);
  }
  isValid(value) {
      return isValid(this.date(value));
  }
  getDiff(value, comparing) {
      return differenceInMilliseconds(value, this.date(comparing));
  }
  isAfter(value, comparing) {
      return isAfter(value, comparing);
  }
  isBefore(value, comparing) {
      return isBefore(value, comparing);
  }
  startOfDay(value) {
      return startOfDay(value);
  }
  endOfDay(value) {
      return endOfDay(value);
  }
  getHours(value) {
      return getHours(value);
  }
  setHours(value, count) {
      return setHours(value, count);
  }
  setMinutes(value, count) {
      return setMinutes(value, count);
  }
  getSeconds(value) {
      return getSeconds(value);
  }
  setSeconds(value, count) {
      return setSeconds(value, count);
  }
  isSameDay(value, comparing) {
      return isSameDay(value, comparing);
  }
  isSameMonth(value, comparing) {
      return isSameMonth(value, comparing);
  }
  isSameYear(value, comparing) {
      return isSameYear(value, comparing);
  }
  isSameHour(value, comparing) {
      return isSameHour(value, comparing);
  }
  startOfMonth(value) {
      return startOfMonth(value);
  }
  endOfMonth(value) {
      return endOfMonth(value);
  }
  getYear(value) {
      return getYear(value);
  }
  setYear(value, count) {
      return setYear(value, count);
  }
  date(value) {
      if (typeof value === 'undefined') {
          return new Date();
      }
      if (value === null) {
          return null;
      }
      return new Date(value);
  }
  parse(value, formatString) {
    if (value === '') {
      return null;
    }
    return parseFns(value, formatString, new Date(), { locale: this.locale });
  }
  format(date, formatString) {
      return format(date, formatString, { locale: this.locale });
  }
  isEqual(date, comparing) {
      if (date === null && comparing === null) {
          return true;
      }
      return isEqual(date, comparing);
  }
  isNull(date) {
      return date === null;
  }
  isAfterDay(date, value) {
      return isAfter(date, endOfDay(value));
  }
  isBeforeDay(date, value) {
      return isBefore(date, startOfDay(value));
  }
  isBeforeYear(date, value) {
      return isBefore(date, startOfYear(value));
  }
  isAfterYear(date, value) {
      return isAfter(date, endOfYear(value));
  }
  formatNumber(numberToFormat) {
      return numberToFormat;
  }
  getMinutes(date) {
      return date.getMinutes();
  }
  getMonth(date) {
      return date.getMonth();
  }
  setMonth(date, count) {
      return setMonth(date, count);
  }
  getMeridiemText(ampm) {
      return ampm === 'am' ? 'AM' : 'PM';
  }
  getNextMonth(date) {
      return addMonths(date, 1);
  }
  getPreviousMonth(date) {
      return addMonths(date, -1);
  }
  getMonthArray(date) {
      const firstMonth = startOfYear(date);
      const monthArray = [firstMonth];
      while (monthArray.length < 12) {
          const prevMonth = monthArray[monthArray.length - 1];
          monthArray.push(this.getNextMonth(prevMonth));
      }
      return monthArray;
  }
  mergeDateAndTime(date, time) {
      return this.setMinutes(this.setHours(date, this.getHours(time)), this.getMinutes(time));
  }
  getWeekdays() {
      const now = new Date();
      return eachDayOfInterval({
          start: startOfWeek(now, { locale: this.locale }),
          end: endOfWeek(now, { locale: this.locale })
      }).map(day => this.format(day, 'EEEEEE'));
  }
  getWeekArray(date) {
      const start = startOfWeek(startOfMonth(date), { locale: this.locale });
      const end = endOfWeek(endOfMonth(date), { locale: this.locale });
      let count = 0;
      let current = start;
      const nestedWeeks = [];
      while (isBefore(current, end)) {
          const weekNumber = Math.floor(count / 7);
          nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
          nestedWeeks[weekNumber].push(current);
          current = addDays(current, 1);
          count += 1;
      }
      return nestedWeeks;
  }
  getYearRange(start, end) {
      const startDate = startOfYear(start);
      const endDate = endOfYear(end);
      const years = [];
      let current = startDate;
      while (isBefore(current, endDate)) {
          years.push(current);
          current = addYears(current, 1);
      }
      return years;
  }
  // displaying methpds
  getCalendarHeaderText(date) {
      return this.format(date, this.yearMonthFormat);
  }
  getYearText(date) {
      return this.format(date, 'yyyy');
  }
  getDatePickerHeaderText(date) {
      return this.format(date, 'EEE, MMM d');
  }
  getDateTimePickerHeaderText(date) {
      return this.format(date, 'MMM d');
  }
  getMonthText(date) {
      return this.format(date, 'MMMM');
  }
  getDayText(date) {
      return this.format(date, 'd');
  }
  getHourText(date, ampm) {
      return this.format(date, ampm ? 'hh' : 'HH');
  }
  getMinuteText(date) {
      return this.format(date, 'mm');
  }
  getSecondText(date) {
      return this.format(date, 'ss');
  }
}