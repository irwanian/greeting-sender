const geoTz = require('geo-tz');
const moment = require('moment');

exports.findUserTimezoneDifference = ({ lat, long }) => {
    const [timeZone] = geoTz.find(lat, long);
    const userTime = moment().tz(timeZone).format();
    const serverTime = moment().format();

    let userGmtDifference = 0;
    let serverGmtDifference = 0;
    if (userTime.slice(-1) !== 'Z') {
        const timezoneHours = Number(userTime.slice(-6, -3));
        const timezoneMinutes = Number(userTime.slice(-2));
        userGmtDifference = (timezoneHours * 60) + timezoneMinutes;
    }

    if (serverTime.slice(-1) !== 'Z') {
        const timezoneHours = Number(serverTime.slice(-6, -3));
        const timezoneMinutes = Number(serverTime.slice(-2));
        serverGmtDifference = (timezoneHours * 60) + timezoneMinutes;
    }

    const timezoneDiff = userGmtDifference - serverGmtDifference;

    return timezoneDiff;
};

module.exports = exports;