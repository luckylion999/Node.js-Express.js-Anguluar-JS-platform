const models = require("../models");
const auth = require("../util/auth/index");
const router = require("express").Router();
const passport = require("passport");
const upload = require("../config/multer");


router.post("/", passport.authenticate("jwt", { session: false }),
    auth.can("Create Category"), (req, res, next) => {
        res.locals.promise = models.Category.createCategory(req.body);
        return next();
});

router.get("/", (req, res, next) => {
    res.locals.promise = models.Category.getCategories();
    return next();
});

router.put("/:categoryId", passport.authenticate("jwt", { session: false }),
    auth.can("Update Category"), (req, res, next) => {
        res.locals.promise = req.params.category.updateCategory(req.body);
        return next();
    });

router.delete("/:categoryId", passport.authenticate("jwt", { session: false }),
    auth.can("Delete Category"), (req, res, next) => {
        res.locals.promise = req.params.category.removeCategory();
        return next();
    });

router.param("categoryId", (req, res, next, categoryId) => {
    models.Category.findById(categoryId)
        .then(category => {
            if(!category) {
                return next(new Error("Category Does Not Exist"));
            } else {
                req.params.category = category;
                return next();
            }
        }, err => next(err) )
});
module.exports = router;
