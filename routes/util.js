const models = require("../models");
const router = require("express").Router();
const passport = require("passport");
const auth = require("../util/auth/index");
const jwtGenerator = require("../util/jwtGenerator");


router.get("/users", passport.authenticate("jwt", { session: false }), auth.can("List Users"), (req, res, next) => {
    res.locals.promise = models.AbstractUser.getUsers();
    return next();
});

router.post("/login", passport.authenticate("local", { session: false }), (req, res, next) => {
    jwtGenerator.generateJwt(req.user.id, (err, jwt) => err ? next(err): res.send(jwt) );
});


module.exports = router;
