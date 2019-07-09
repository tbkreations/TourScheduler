const mongoose = require("mongoose")

const TourSchema = new mongoose.Schema({
    reqFirstName: {
        type: String,
        required: true
    },
    reqLastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    groupClass: {
        type: String,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    tourType: {
        type: String,
        required: true
    }
});

// , {timestamps: true}
// TourSchema.index({createdAt: 1})
const Tour = mongoose.model('Tour', TourSchema);
module.exports = Tour;