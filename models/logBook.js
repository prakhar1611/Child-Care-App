const mongoose = require('mongoose')

const logBookSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },

    roll: {
        type: Number,
        min: 0,
        required: true
    },

    classs: {
        type: Number,
        min: 1,
        max: 12,
        required: true
    },

    parentPhone:{
        type: Number,
        trim: true,
        required: true
    },

    parentEmail: {
        type: String,
        trim:true,
        required: true
    },

    logDate:{
        type:String,
    }
});

const logBook = mongoose.model('logBook',logBookSchema)
module.exports= logBook
