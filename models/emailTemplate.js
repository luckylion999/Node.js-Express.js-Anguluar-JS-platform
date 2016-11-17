const mongoose = require("mongoose");
const validator = require("validator");
const defaultTemplates = require("../res/emailTemplate").defaultTemplate;


const TYPE = {
    REGISTER: "REGISTER",
    LOGIN: "LOGIN",
    RESET: "RESET",
    FORGET: "FORGET",
    ADDCONTENT: "ADDCONTENT",
    MODIFYCONTENT: "MODIFYCONTENT",
    DELETECONTENT: "DELETECONTENT",
    APPROVECONTENT: "APPROVECONTENT"
};

const emailTemplateSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [ TYPE.REGISTER, TYPE.LOGIN, TYPE.RESET, TYPE.FORGET, TYPE.ADDCONTENT, TYPE.MODIFYCONTENT, TYPE.DELETECONTENT, TYPE.APPROVECONTENT ],
    },
    template: {
        arabic: {
            title: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            }
        },
        english: {
            title: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            }
        }
    },
    original_template: {
        arabic: {
            title: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            }
        },
        english: {
            title: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            }
        }
    }

});

emailTemplateSchema.statics.createTemplate = function (templateInfo) {
    return this.create(templateInfo)
};

emailTemplateSchema.statics.createTemplate = function (templateInfo) {
    return this.create(templateInfo)
};

emailTemplateSchema.statics.resetAll = function () {
    this.remove();
    return this.collection.insert(defaultTemplates);
};





emailTemplateSchema.methods.updateTemplate = function (templateInfo) {
    return this.update(templateInfo);
};

emailTemplateSchema.methods.removeTemplate = function () {
    return this.remove();
};

emailTemplateSchema.statics.getTemplates = function () {
    return this.find();
};

emailTemplateSchema.statics.getTemplate = function (templateId) {
    return this.findOne(templateId);
};

emailTemplateSchema.statics.getTemplateByType = function (templateType) {
    return this.findOne({ type: templateType });
};

emailTemplateSchema.methods.reset = function () {
    this.template = this.original_template;
    return this.save();
};

module.exports = {
    emailTemplateSchema: emailTemplateSchema,
    type: TYPE,
    EmailTemplate: mongoose.model("EmailTemplate", emailTemplateSchema)
};