const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    exercise: { type: String, required: true },
    date: { type: Date, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
});

module.exports = mongoose.model('Progress', progressSchema);