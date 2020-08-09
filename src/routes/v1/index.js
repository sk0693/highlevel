const express = require('express');
// const userRoute = require('./user.route');
const appointmentRoute = require('./appointment.route');

const router = express.Router();

// router.use('/users', userRoute);
router.use('/appointments', appointmentRoute);

module.exports = router;
