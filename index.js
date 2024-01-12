const fs = require('fs');
const csv = require('csv-parser');
const inputfile = 'Assignment.csv'

const employees7ConsecutiveDays = [];
const employeesLessThan10HoursBetweenShifts = [];
const employeesMoreThan14HoursInSingleShift = [];

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
}

// Function to calculate the Shifts Hours
function hoursBetweenShifts(timeOut, timeIn) {
    const millisecondsInHour = 3600000;
    const diffInMilliseconds = timeOut - timeIn;
    return diffInMilliseconds / millisecondsInHour;
}
// Function to calculate the number of  consecutive days 
function employeesConsecutive(payCycleStart, payCycleEnd) {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in one day
    const daysDifference = Math.floor((payCycleEnd - payCycleStart) / millisecondsInOneDay) + 1;
    return daysDifference
}

fs.createReadStream(inputfile)
    .pipe(csv())
    .on('data', (row) => {
        const positionID = row['Position ID'];
        const employeeName = row['Employee Name'];
        const timeIn = new Date(row['Time']);
        const timeOut = new Date(row['Time Out']);
        const timecardHours = parseTime(row['Timecard Hours (as Time)']);
        const payCycleStart = new Date(row['Pay Cycle Start Date']);
        const payCycleEnd = new Date(row['Pay Cycle End Date']);

        if (employeesConsecutive(payCycleStart, payCycleEnd,) > 7) {
            employees7ConsecutiveDays.push({ positionID, employeeName });
        }

        if (hoursBetweenShifts(timeOut, timeIn) < 10 && hoursBetweenShifts(timeOut, timeIn) > 1) {
            employeesLessThan10HoursBetweenShifts.push({ positionID, employeeName });
        }

        if (timecardHours > 14) {
            employeesMoreThan14HoursInSingleShift.push({ positionID, employeeName });
        }
    })
    .on('end', () => {
        console.log('Employees who worked for 7 consecutive days:', employees7ConsecutiveDays);
        console.log('Employees with less than 10 hours between shifts but greater than 1 hour:', employeesLessThan10HoursBetweenShifts);
        console.log('Employees who worked for more than 14 hours in a single shift:', employeesMoreThan14HoursInSingleShift);

        const outputText = `
             Employees who worked for 7 consecutive days: ${JSON.stringify(employees7ConsecutiveDays)}
             Employees with less than 10 hours between shifts but greater than 1 hour: ${JSON.stringify(employeesLessThan10HoursBetweenShifts)}
             Employees who worked for more than 14 hours in a single shift: ${JSON.stringify(employeesMoreThan14HoursInSingleShift)}
             `;
        fs.writeFileSync('output.txt', outputText);
    });
