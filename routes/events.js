const express = require('express')
const router = express.Router()

const { getAllEvents, 
    getEvent, 
    createEvent, 
    updateEvent, 
    deleteEvent } = require('../controllers/events')

    router.route('/').post(createEvent).get(getAllEvents)
    router.route('/:id').get(getEvent).delete(deleteEvent).patch(updateEvent)

    module.exports = router