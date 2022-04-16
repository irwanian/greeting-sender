const geoTz = require('geo-tz');
const moment = require('moment');

exports.findUserTimezoneDifference = ({ lat, long }) => {
    const [timeZone] = geoTz.find(lat, long);
    const userTime = moment().tz(timeZone).format();
    let gmtDifference = 0;
    if (userTime.slice(-1) !== 'Z') {
        const timezoneHours = Number(userTime.slice(-6, -3));
        const timezoneMinutes = Number(userTime.slice(-2));
        gmtDifference = (timezoneHours * 60) + timezoneMinutes;
    }

    const timezoneDiff = gmtDifference + -420; // GMT+7;

    return timezoneDiff;
};

module.exports = exports;