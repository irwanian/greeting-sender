const validate = (schema, property) => (req, res, next) => {
    const input = {...req.body || null, ...req.params || null, ...req.query };
    const { error } = schema.validate(input);

    if (error) {
        res.error(error);
    }
    else {
        next();
    }
};

module.exports = { validate };