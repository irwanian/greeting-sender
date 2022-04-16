const UserQueries = require('../../queries/user');

module.exports.deleteUser = async (req, res, next) => {
    try {
        const input = req.params;
        const where = { unique_id: input.id, status: 'active' };
        const existingUser = await UserQueries.findOne(where);
        if (!existingUser) {
            return res.error({ code: 404, message: 'User does not exist' });
        }

        await UserQueries.delete(input.id, { status: 'removed' });

        return res.success({ payload: {}, message: 'Delete Success' });
    } catch (err) {
        return res.error(err);
    }
};