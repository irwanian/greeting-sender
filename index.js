const express = require('express');
require('dotenv').config();
const { sequelize } = require('./src/models').mysql;
const BirthdayGreetScheduler = require('./src/utils/birthday_greet_scheduler');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.success = ({ payload, message, code }) => {
        res.status(code || 200).send({
            code: code || 200,
            message: message || 'success',
            payload: payload || {}
        });
    };

    res.error = (error) => {
        res.status(error.code || 400).send({
            code: error.code || 400,
            message: error.message || 'error',
            payload: error.payload || {}
        });
    };

    next();
});

app.get('/', (req, res) => {
    res.success({ payload: 'BANZAI!!!'});
});

app.use('/user', require('./src/routes/user'));

sequelize.sync()
    .then(async () => {
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`App running on port: ${port}`);
        });
        BirthdayGreetScheduler.start();
    })
    .catch((err) => {
        throw err;
    });
