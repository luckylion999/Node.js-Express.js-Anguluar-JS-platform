const mongoose = require("mongoose");
const imageSchema = require("./image");
const commentSchema = require("./comment");
const User = require("./user").User;
const Language = require("./language").Language;


const STATUS = {
    PUBLISHED: "PUBLISHED",
    APPROVED: "APPROVED",
    PROVOKED: "PROVOKED",
    PENDING: "PENDING",
    ONHOLD: "ONHOLD",
    SUSPENDED: "SUSPENDED"
};

const articleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        validate: {
            validator: (userId, done) => {
                User.count({ _id: userId })
                    .then(count => {
                        return done(count);
                    }, err => {
                        //TODO: log
                        return done(false, err);
                    });
            },
            message: "User Does Not Exist"
        }
    },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true,
        validate: {
            validator: (languageId, done) => {
                Language.count({ _id: languageId})
                    .then(count => {
                        return done(count);
                    }, err => {
                        //TODO: log
                        return done(false, err);
                    });
            },
            message: "Language Does Not Exist"
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: true,
        validate: {
            validator: (userId, done) => {
                User.count({ _id: userId })
                    .then(count => {
                        return done(count);
                    }, err => {
                        //TODO: log
                        return done(false, err);
                    });
            },
            message: "User Does Not Exist"
        }
    }],
    title: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: [ STATUS.PUBLISHED, STATUS.APPROVED, STATUS.PROVOKED, STATUS.PENDING, STATUS.ONHOLD , STATUS.SUSPENDED ],
        default: STATUS.PENDING
    },
    tags: [{
        type: String,
        required: false
    }],
    editorPick: {
        type:Boolean,
        default: false
    },
    cover: imageSchema,
    photos: [ imageSchema ],
    comments: [ commentSchema ]
}, { timestamps: true });


articleSchema.statics.createArticle = function (articleInfo) {
    return this.create(articleInfo);
};

articleSchema.methods.updateArticle = function (articleInfo) {
    return this.update(articleInfo, { runValidators: true });
};

articleSchema.methods.removeArticle = function () {

    return this.remove();
};

articleSchema.statics.getArticles = function () {
    
    return this.getAll();
};

articleSchema.statics.getFeatured = function () {
    
    return this.getAll()
        .where(editorPick).eq(true)
        ;
};

articleSchema.statics.getAll = function () {
    return this.find()
        .populate({
            path: 'user',
            populate: {
                path: 'language'
            }
        })
        .populate('language')
        .populate('tags')
        .populate('comments.language')
        .populate({
            path: 'comments.user',
            populate: {
                path: 'language'
            }
        });
};

articleSchema.statics.getModel = function (id) {

    return this.findById(id)
        .populate({
            path: 'user',
            populate: {
                path: 'language'
            }
        })
        .populate('language')
        .populate('tags')
        .populate('comments.language')
        .populate({
            path: 'comments.user',
            populate: {
                path: 'language'
            }
        });
};

articleSchema.statics.getFilteredArticles = function (status) {
    
    return this.getAll()
        .where('status').eq(status);
    
};

articleSchema.methods.addComment = function (commentInfo) {
    this.comments.addToSet(commentInfo);
    
    return this.save()
        .then(result => {

            //reload document
            //TODO: WARNING!! UGLY CODE!! rewrite & optimize it!
            var _model = require("./article").Article;
            
            return _model.getModel(result._id);
        });    
};

articleSchema.methods.removeComment = function (commentId) {
    this.comments.pull(commentId);
    return this.save();
};

articleSchema.methods.addPhoto = function (photosInfo) {
    this.photos.addToSet(...photosInfo);
    return this.save();
};

articleSchema.methods.removePhoto = function (photoId) {
    this.photos.pull(photoId);
    return this.save();
};


/**
 *@param iterableObj tags
 */
articleSchema.methods.addTag = function (tags) {

    this.tags.addToSet(...tags);
    
    return this.save();
};

articleSchema.methods.removeTag = function (tag) {
    this.tags.pull(tag);
    return this.save();
};

articleSchema.methods.like = function (userId) {
    this.likes.addToSet(userId);
    return this.save();
};

articleSchema.methods.unlike = function (userId) {
    this.likes.pull(userId);
    return this.save();
};


articleSchema.methods.publish = function () {
    this.status = STATUS.PUBLISHED;
    return this.save();
};


articleSchema.methods.approve = function () {
    this.status = STATUS.APPROVED;
    return this.save();
};

articleSchema.methods.hold = function () {
    this.status = STATUS.ONHOLD;
    return this.save();
};

articleSchema.methods.suspend = function () {
    this.status = STATUS.SUSPENDED;
    return this.save();
};

articleSchema.methods.provoke = function () {
    this.status = STATUS.PROVOKED;
    return this.save();
};


module.exports = {
    articleSchema: articleSchema,
    Article: mongoose.model("Article", articleSchema)
};

/*const Tag = require("./tag").Tag;
articleSchema.add({
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
        validate: {
            validator: (tagId, done) => {
                Tag.count({ _id: tagId })
                //TODO: log
                    .then(count => done(count), err => done(false, err));
            },
            message: "Tag Does Not Exist"
        }
    }]
});*/
