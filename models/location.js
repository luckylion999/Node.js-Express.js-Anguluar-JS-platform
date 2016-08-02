const mongoose = require("mongoose");


const locationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true,
        unique: true
    }
});

locationSchema.statics.createLocation = function (locationInfo) {
    return this.create(locationInfo);
};

locationSchema.methods.updateLocation = function (locationInfo) {
    return this.update(locationInfo, { runValidators: true });
};

locationSchema.methods.removeLocation = function () {
    return this.remove();
};

locationSchema.statics.getLocations = function () {
    return this.find();
};


module.exports.locationSchema = locationSchema;
module.exports.Location = mongoose.model("Location", locationSchema);