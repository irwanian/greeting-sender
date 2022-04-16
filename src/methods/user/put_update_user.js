const UserQueries = require('../../queries/user');
const UserService = require('../../service/user');

module.exports.putUpdateUser = async (req, res, next) => {
    try {
        const input = { ...req.body, ...req.params };
        const where = { unique_id: input.id, status: 'active' };
        let existingUser = await UserQueries.findOne(where);
        existingUser = JSON.parse(JSON.stringify(existingUser));
        if (!existingUser) {
            return res.error({ code: 404, message: 'User does not exist' });
        }

        const [lat, long] = [(input.location || {}).latitude, (input.location || {}).longitude];
        const timeZonePayload = {
            lat: lat || existingUser.location.latitude,
            long: long || existingUser.location.longitude
        };

        let userAndServerTimezoneDiff = existingUser.timezone_diff;
        if (lat || long) {
            userAndServerTimezoneDiff = UserService.findUserTimezoneDifference(timeZonePayload);
        }
        const userModelPayload = {
            first_name: input.first_name || existingUser.first_name,
            last_name: input.last_name || existingUser.last_name,
            location: input.location || existingUser.location,
            timezone_diff: userAndServerTimezoneDiff,
            birth_date: input.birth_date || existingUser.birth_date
        };

        await UserQueries.update(existingUser.unique_id, userModelPayload);

        return res.success({ payload: 'Update Success' });
    } catch (err) {
        return res.error(err);
    }
};