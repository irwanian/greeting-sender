const Models = require('../models').mysql;

const { sequelize, Sequelize: { QueryTypes }, user: UserModel } = Models;

exports.findOne = (where = {}) => UserModel.findOne({ where });
exports.findAll = (where = {}) => UserModel.findAll({ where });
exports.update = (id, data = {}) => UserModel.update(data, {
    where: { unique_id: id }
});

exports.delete = (id, data = {}) => UserModel.update(data, {
    where: { unique_id: id }
});

exports.create = (data) => UserModel.create(data);
exports.getBirthdayPeopleInFourDaysRange = (data) => sequelize.query(
    `SELECT * FROM users
        WHERE
            status = 'active'
        AND
            json_contains(birthday_greet_year, '${data.this_year}') = 0
        AND
            MONTH(birth_date) = '${data.this_month}'
        AND
            DAY(birth_date)
        BETWEEN '${data.three_days_ago}' AND '${data.today}'
`, { type: QueryTypes.SELECT });

exports.updateSUccessGreetingData = (data) => sequelize.query(
    `UPDATE users
        SET
            ${data.event}_greet_year = json_array_append(${data.event}_greet_year, '$', ${data.this_year})
        WHERE id IN (${data.success_ids})
        AND
            json_contains(${data.event}_greet_year, '${data.this_year}') = 0`, { type: QueryTypes.UPDATE });

module.exports = exports;