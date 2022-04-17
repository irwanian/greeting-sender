const cron = require('node-cron');
const moment = require('moment');
const axios = require('axios');
const UserQueries = require('../queries/user');

const greetingTime = ['13:52', '03:01', '02:02', '02:03', '02:04', '02:05'];
const [thisMonth, threeDaysAgo, today] = [
    moment().format('MM'), moment().subtract(3, 'days').format('DD'), moment().format('DD')
];

const getBirthdayPeopleInFourDaysRange = async (thisYear) => {
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
        this_year: thisYear,
        event: data[0].event
    });
};

const greetPersonSpecialEvent = async (birthdayPerson, event) => {
    const result = {
        success: true,
        event
    };
    const birthdayMonthAndDate = moment(birthdayPerson.birth_date).format('MM-DD');
    const todayMonthAndDate = `${thisMonth}-${today}`;
    const hookbinPayload = {
        event
    };

    if (event === 'birthday') {
        hookbinPayload.message = `Happy${birthdayMonthAndDate === todayMonthAndDate ? ' ': ' belated '}Birthday ${birthdayPerson.first_name} ${birthdayPerson.last_name}`;
    }

    try {
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
    const birthdayPeopleInRange = await getBirthdayPeopleInFourDaysRange(thisYear);
    const ungreetedBirthdayPeople = birthdayPeopleInRange.filter(birthdayPerson => greetingTime.includes(moment().add(birthdayPerson.timezone_diff, 'minutes').format('HH:mm')));
    
    if (ungreetedBirthdayPeople.length > 0) {
        const chunkSize = 50;
        const chunks = [];
        for (let i = 0; i < ungreetedBirthdayPeople.length; i += chunkSize) {
            chunks.push(ungreetedBirthdayPeople.slice(i, i + chunkSize));
        }
        
        const fn = async (birthdayBatch) => {
            const greetingResults = [];
            const promises = birthdayBatch.map(async (birthdayPerson) => {
                const greetingResult = await greetPersonSpecialEvent(birthdayPerson, 'birthday');
    
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