const models = require("../models");
const router = require("express").Router();
const mustbe = require("mustbe").routeHelpers();
const passport = require("passport");
const upload = require("multer")({ dest: "uploads/business" });


router.post("/business", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Create Business"), upload.single("logo"), (req, res, next) => {
    req.body.owner = req.user;
    if(req.file) req.body.logo = { path: req.file.path };

    res.locals.promise = models.Business.createBusiness(req.body);
    return next();
});

router.put("/business/:businessId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Update Business"), upload.single("logo"), (req, res, next) => {
    if(req.file) req.body.logo = { path: req.file.path };

    res.locals.promise = req.params.business.updateBusiness(req.body);
    return next();
});

router.delete("/business/:businessId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Delete Business"), (req, res, next) => {
    req.params.business.removeBusiness();
    return next();
});

router.get("/business/:businessId", (req, res, next) => res.send(req.params.business) );

router.get("/businesses", (req, res, next) => {
    res.locals.promise = models.Business.getBusinesses();
    return next();
});


router.post("/business/:businessId/socialMedia", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Social Media"), (req, res, next) => {
    req.params.business.addSocialMedia(req.body);
    return next();
});

router.delete("/business/:businessId/socialMedia/:socialMediaId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Remove Business Social Media"), (req, res, next) => {
    req.params.business.removeSocialMedia(req.params.socialMediaId);
    return next();
});

//TODO: set a limit of the number of uploads
router.post("/business/:businessId/photo", upload.array("photo"), passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Photo"), (req, res, next) => {
    try {
        res.locals.promise = req.params.business.addPhoto(req.files.map(photo => ({ path: photo.path }) ));
        return next();
    } catch(err) {
        return next(new Error("You Should Use Form-Data Encoding Only With This End Point"))
    }
});

router.delete("/business/:businessId/photo/:photoId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Delete Business Photo"), (req, res, next) => {
    res.locals.promise = req.params.business.removePhoto(req.params.photoId);
    return next();
});


router.post("/business/:businessId/tag", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Tag"), (req, res, next) => {
    res.locals.promise = req.params.business.addTag(req.body);
    return next();
});

router.delete("/business/:businessId/tag/:tag", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Delete Business Tag"), (req, res, next) => {
    res.locals.promise = req.params.business.removeTag(req.params.tag);
    return next();
});


router.post("/business/:businessId/branch", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Branch"), (req, res, next) => {
    res.locals.promise = req.params.business.addBranch(req.body);
    return next();
});

router.delete("/business/:businessId/branch/:branchId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Delete Business Branch"), (req, res, next) => {
    res.locals.promise = req.params.business.removeBranch(req.params.branchId);
    return next();
});


router.post("/business/:businessId/category", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Category"), (req, res, next) => {
    res.locals.promise = req.params.business.addCategory(req.body.category);
    return next();
});

router.delete("/business/:businessId/category/:categoryId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Remove Business Category"), (req, res, next) => {
    res.locals.promise = req.params.business.removeCategory(req.params.categoryId);
    return next();
});


router.post("/business/:businessId/option", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Option"), (req, res, next) => {
    res.locals.promise = req.params.business.addOption(req.body);
    return next();
});

router.delete("/business/:businessId/option/:optionId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Delete Business Option"), (req, res, next) => {
    res.locals.promise = req.params.business.removeOption(req.params.optionId);
    return next();
});


router.post("/business/:businessId/review", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Review"), (req, res, next) => {
    req.body.user = req.user;

    res.locals.promise = req.params.business.addReview(req.body);
    return next();
});

router.delete("/business/:businessId/review/:reviewId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Remove Business Review"), (req, res, next) => {
    res.locals.promise = req.params.business.removeReview(req.params.reviewId);
    return next();
});

router.post("/business/:businessId/review/:reviewId/comment", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Comment Business Review"), (req, res, next) => {
    req.body.user = req.user;

    try {
        res.locals.promise = req.params.business.addCommentToReview(req.params.reviewId, req.body)
        return next();
    } catch(err) {
        return next(new Error("Review Does Not Exist"));
    }
});

router.delete("/business/:businessId/review/:reviewId/comment/:commentId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Remove Comment On Business Review"), (req, res, next) => {
    try {
        res.locals.promise = req.params.business.removeCommentFromReview(req.params.reviewId, req.params.commentId)
        return next();
    } catch(err) {
        return next(new Error("Review Does Not Exist"));
    }
});


router.post("/business/:businessId/rating", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Rating"), (req, res, next) => {
    req.body.user = req.user;

    res.locals.promise = req.params.business.addRating(req.body);
    return next();
});

router.delete("/business/:businessId/rating/:ratingId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Remove Business Rating"), (req, res, next) => {
    res.locals.promise = req.params.business.removeRating(req.params.ratingId);
    return next();
});


router.post("/business/:businessId/collection", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Add Business Collection"), (req, res, next) => {
    res.locals.promise = req.params.business.addCollection(req.body.collection);
    return next();
});

router.delete("/business/:businessId/collection/:collectionId", passport.authenticate("jwt", { session: false }),
    mustbe.authorized("Remove Business Collection"), (req, res, next) => {
    res.locals.promise = req.params.business.removeCollection(req.params.collectionId);
    return next();
});


router.param("businessId", (req, res, next, bossinessId) => {
    models.Business.findById(bossinessId)
        .then(business => {
            if(!business) {
                return next(new Error("Business Does Not Exist"));
            } else {
                req.params.business = business;
                return next();
            }
        }, err => next(err) )
});


module.exports = router;