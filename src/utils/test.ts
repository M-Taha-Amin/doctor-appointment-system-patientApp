import { format, isAfter } from 'date-fns';

let current = new Date();
const eightPM = new Date().setHours(20, 0, 0, 0);
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

let index = days.findIndex(val => val === format(current, 'EEEE'));
const bookingDays = [];

if (isAfter(current, eightPM)) {
  index = (index + 1) % days.length;
  bookingDays.push(days[index]);
}

while (bookingDays.length < 7) {
  
}
