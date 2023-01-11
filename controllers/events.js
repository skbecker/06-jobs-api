const Event = require('../models/event')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllEvents = async (req, res) => {
    res.send('get all events')
}

const getEvent = async (req, res) => {
    res.send('get an event')
}

const createEvent = async (req, res) => {
    req.body.createdBy = req.user.userId
    const event = await Event.create(req.body)
    res.status(StatusCodes.CREATED).json({event})
}

const updateEvent = async (req, res) => {
    res.send('update an events')
}

const deleteEvent = async (req, res) => {
    res.send('delete an events')
}

module.exports = {
    getAllEvents,
    createEvent,
    updateEvent,
    getEvent,
    deleteEvent
}