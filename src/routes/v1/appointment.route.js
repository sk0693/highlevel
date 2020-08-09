const express = require('express');
// const eventsController = require('../../controllers/events.controller');
// const slotsController = require('../../controllers/slots.controller');
const appointmentController = require('../../controllers/appointments.controller');


const router = express.Router();


router.post('/free-slots', appointmentController.getFreeSlots);
router.post('/bookAppointment', appointmentController.bookAppointment);
router.post('/getAppointmentsInBetweenDates', appointmentController.getAppointmentsInBetweenDates);

module.exports = router;