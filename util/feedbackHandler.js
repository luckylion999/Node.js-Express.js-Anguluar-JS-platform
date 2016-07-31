
module.exports.successHandler = (req, res, next) => {
    return res.send(res.result);
};

module.exports.failureHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    } else if(err.__proto__.constructor.name == "MongooseError") {
        return res.status(400).send(err);
    } else {
        return res.status(400).send(err.message);
    }
};