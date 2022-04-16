const cron = require('node-cron');
const moment = require('moment');
const axios = require('axios');
const UserQueries = require('../queries/user');

const getBirthdayPeopleInFourDaysRange = async (thisYear) => {
    const [thisMonth, threeDaysAgo, today] = [
        moment().format('MM'), moment().subtract(3, 'days').format('DD'), moment().format('DD')
    ];
    const birthdayPeople = await UserQueries.getBirthdayPeopleInFourDaysRange({
        this_year: thisYear,
        this_month: thisMonth,
        today,
        three_days_ago: threeDaysAgo
    });

    return birthdayPeople;
};

const handleSuccessGreetings = async (data, thisYear) => {
    const successIds = data.map(val => val.id);
    await UserQueries.updateSUccessGreetingData({
        success_ids: successIds,
        this_year: thisYear
    });
};

const greetPersonHappyBirthday = async (birthdayPerson) => {
    const result = {
        success: true
    };
    try {
        const hookbinPayload = {
            event: 'birthday',
            message: `Happy Birthday ${birthdayPerson.first_name} ${birthdayPerson.last_name}`
        };
        const requestResult = await axios.post(process.env.HOOKBIN_URL, hookbinPayload);
        if (!requestResult.data.success) {
            result.id = birthdayPerson.id;
            result.success = false;
        }

        result.id = birthdayPerson.id;
        return result;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
        result.success = false;
        result.id = birthdayPerson.id;
        return result;
    }
};

const greetPeopleHappyBirthday = async () => {
    const thisYear = moment().format('YYYY');
    const birthdayPeopleRange = await getBirthdayPeopleInFourDaysRange(thisYear);
    const checkTime = ['09:00', '09:01', '09:02', '09:03', '09:04', '09:05'];
    const ungreetedBirthdayPeople = birthdayPeopleRange.filter(birthdayPerson => checkTime.includes(moment().add(birthdayPerson.timezone_diff, 'minutes').format('HH:mm')));
    
    if (ungreetedBirthdayPeople.length > 0) {
        const chunkSize = 50;
        const chunks = [];
        for (let i = 0; i < ungreetedBirthdayPeople.length; i += chunkSize) {
            chunks.push(ungreetedBirthdayPeople.slice(i, i + chunkSize));
        }
        
        const fn = async (birthdayBatch) => {
            const greetingResults = [];
            const promises = birthdayBatch.map(async (birthdayPerson) => {
                const greetingResult = await greetPersonHappyBirthday(birthdayPerson);
    
                return Promise.resolve(greetingResult);
            });
    
            const promisesResult = await Promise.all(promises);
            greetingResults.push(...promisesResult);
            const successData = greetingResults.filter(data => data.success);
            if (successData.length > 0) {
                await handleSuccessGreetings(successData, thisYear);
            }
        };
        // Executes sequentially.

        await chunks.reduce((p, batch) => p.then(() => fn(batch)), Promise.resolve());
    }
    // Greet Happy Birthday per 50 people
};

// Task running at minute 0, 15, 30, 45 every hour
const task = cron.schedule('0,15,30,45 * * * *', () => {
    greetPeopleHappyBirthday();
}, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
});

module.exports = task;