const UserQueries = require('../../queries/user');
const UserService = require('../../service/user');


module.exports.postCreateUser = async (req, res, next) => {
    try {
        const input = req.body;
        const timeZonePayload = {
            lat: input.location.latitude,
            long: input.location.longitude
        };

        const userAndServerTimezoneDiff = UserService.findUserTimezoneDifference(timeZonePayload);
        const UserModelPayload = {
            first_name: input.first_name,
            last_name: input.last_name,
            location: input.location,
            timezone_diff: userAndServerTimezoneDiff,
            birth_date: input.birth_date,
            birthday_greet_year: []
        };

        let payload = await UserQueries.create(UserModelPayload);
        payload = JSON.parse(JSON.stringify(payload));

        return res.success({ payload });
    } catch (err) {
        return res.error(err);
    }
};