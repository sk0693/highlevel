const httpStatus = require('http-status');
const { app_config, firestore } = require('../config/config');
const logger = require('../config/logger');

var admin = require("firebase-admin");
var serviceAccount = require("../../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gohighlevel-b1160.firebaseio.com"
});
const db = admin.firestore();

const moment = require('moment-timezone');


/**
 * 
 * Get all Available Slots for the given date
 * @param {dateTime: String, timezone: String} req 
 * @param {available_slots: Array} res 
 */

const getFreeSlots = async (req, res) => {
    try {
        let { date, timezone } = req.body;
        if (!date || !timezone) {
            throw 'date or timezone not found';
        }

        let { start_hours, end_hours, duration } = app_config;

        let startTime = moment(date);
        startTime.set({ hour: start_hours, minute: 0, second: 0, millisecond: 0 });

        let endTime = moment(date);
        endTime.set({ hour: end_hours, minute: 0, second: 0, millisecond: 0 });

        let total_slots = ((end_hours - start_hours) * 60) / duration;
        let mill_sec_duration = duration * 1000 * 60;
        let available_slots = [];

        let booked_timestamp = await getDataFromFireStoreInBetweenDates(startTime, endTime, timezone);

        for (let i = 1; i <= total_slots; i++) {
            let converted_date = moment(startTime.valueOf() + (mill_sec_duration * i)).tz(timezone).format();

            let utcDateTimestamp = getUtcTimestamp(converted_date, timezone);

            if (booked_timestamp.indexOf(utcDateTimestamp) == -1) {
                available_slots.push(converted_date);
            }
        }

        return res.status(httpStatus.OK).send(available_slots);

    } catch (error) {
        console.error("error getAllFreeSlots", error);
        throw error;
    }
}

/**
 * For Book an Appointment
 * @param {dateTime: String, timezone: String} req 
 * @param {dateTime: UtcDateTime, duration: Number} res 
 */

const bookAppointment = async (req, res) => {
    try {
        const { dateTime, timezone } = req.body;

        if (!dateTime || !timezone) {
            throw "Date or time or timezone not found";
        }

        let { duration } = app_config;

        let utcDateTime = getUtcTimestamp(dateTime, timezone);

        const docRef = db.collection(firestore.collection).doc();

        await docRef.set({
            dateTime: utcDateTime,
            duration,
        });

        return res.status(httpStatus.OK).send({
            dateTime,
            utcDateTime
        });
    } catch (error) {
        logger.error(error);
        res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

/**
 * 
 * For Fetch All Appointments in between 2 dates
 * @param {startDate: String, endData: String, timezone: String(optional)} req 
 * @param {booked_timestamp: Array, startDate: String, endData: String, timezone: string} res 
 */
const getAppointmentsInBetweenDates = async (req, res) => {
    try {
        let { startDate, endDate, timezone } = req.body;
        if (!startDate || !endDate) {
            throw 'startDate or endDate not found';
        }

        if (!timezone) {
            timezone = app_config['timezone'];
        }

        let booked_timestamp = await getDataFromFireStoreInBetweenDates(startDate, endDate, timezone);

        booked_timestamp = booked_timestamp.map((timestamp) => {
            return moment(timestamp).tz(timezone).format()
        });

        let response = {
            startDate: moment(startDate).tz(timezone).format(),
            endDate: moment(endDate).tz(timezone).format(),
            timezone,
            booked_timestamp
        }

        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.error("getEventsBetweenDates error", error);
        throw error;
    }
}

// utilities
async function getDataFromFireStoreInBetweenDates(startTime, endTime, timezone) {
    let booked_timestamp = [];
    const appointmentsRef = db.collection(firestore.collection);
    const snapshot = await appointmentsRef
        .where('dateTime', '>=', getUtcTimestamp(startTime, timezone))
        .where('dateTime', '<=', getUtcTimestamp(endTime, timezone))
        .get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return booked_timestamp;
    }

    snapshot.forEach(doc => {
        let data = doc.data();
        booked_timestamp.push(data['dateTime']);
    });

    return booked_timestamp;
}

function getUtcTimestamp(dateTime, timezone) {
    if (!timezone) {
        timezone = app_config['timezone'];
    }
    let timestamp = (moment(dateTime).tz(timezone).utc()).valueOf();
    return timestamp;
}

module.exports = {
    getFreeSlots,
    bookAppointment,
    getAppointmentsInBetweenDates,
};
