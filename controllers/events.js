const Event = require('../models/event')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')
const { JsonWebTokenError } = require('jsonwebtoken')

const getAllEvents = async (req, res) => {
    const events = await Event.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({events, count: events.lengths})
}

const getEvent = async (req, res) => {
    const {user:{userId}, params:{id:eventId}} = req

    const event = await Event.findOne({
        _id:eventId,createdBy:userId
    })
    if(!event){
        throw new NotFoundError(`No event with id ${eventId}`)
    }
    res.status(StatusCodes.OK).json({ event })
}

const createEvent = async (req, res) => {
    req.body.createdBy = req.user.userId
    const event = await Event.create(req.body)
    res.status(StatusCodes.CREATED).json({event})
}

const updateEvent = async (req, res) => {
    const {
        body: {eventName, eventType},
        user:{userId}, 
        params: {id:eventId}
    } = req

        if(eventName === '' || eventType === '') {
            throw new BadRequestError('Event or Event Type fields cannot be empty')
        }
        const event = await Event.findByIdAndUpdate({
            _id:eventId,createdBy:userId
        },req.body, {new:true,runValidators:true})

        if(!event){
            throw new NotFoundError(`No event with id ${eventId}`)
        }
        res.status(StatusCodes.OK).json({ event })
}

const deleteEvent = async (req, res) => {
    const {
        user:{userId}, 
        params: {id:eventId}
    } = req

    const event = await Event.findByIdAndRemove({
        _id:eventId,
        createdBy:userId
    })

    if(!event){
        throw new NotFoundError(`No event with ${eventId}`)
    }

    res.status(StatusCodes.OK).send
}

module.exports = {
    getAllEvents,
    createEvent,
    updateEvent,
    getEvent,
    deleteEvent
}