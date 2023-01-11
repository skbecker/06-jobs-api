const { number } = require('joi')
const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:[true, 'Please provide event name'],
        maxLength: 50
    },
    eventDate:{
        type:Date,
        default: Date.now,
        required: [true, 'Please provide an event date'],
        },
    eventDescription: {
        type:String,
        maxLength: 200
    },
    eventType: {
        type:String,
        required: [true, 'Please choose an event type'],
        enum: ['social', 'work', 'entertainment', 'errand', 'health', 'fitness'],
        default: 'social'
    },
    eventDuration: {
        type:Number,
        default: 1
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required:[true, 'Please provide user']

    }
}, {timestamps: true})

module.exports = mongoose.model('Event', EventSchema)