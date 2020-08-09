const httpStatus = require('http-status');
// const { userService, tokenService } = require('../services');
const { app_config } = require('../config/config');
const logger = require('../config/logger');

var admin = require("firebase-admin");
var serviceAccount = require("../../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gohighlevel-b1160.firebaseio.com"
});
const db = admin.firestore();

// const moment = require('moment');
var moment = require('moment-timezone');


const getAllFreeSlots = async (req, res) => {
    try {
        let { date, timezone } = req.body;
        if (!date || !timezone) {
            throw 'date or timezone not found';
        }

        let { start_hours, end_hours, duration } = app_config;

        let startTime = moment(date);
        startTime.set({ hour: start_hours, minute: 0, second: 0, millisecond: 0 });
        
        
        // let startTime = getConvertedTime(date, timezone);
        // console.log('startTime', startTime);
        // console.log('startTime', startTime);
        // startTime.setHours(start_hours);
        // endTime.setHours(end_hours, 0, 0, 0);

        let total_slots = ((end_hours - start_hours) * 60) / duration;
        let mill_sec_duration = duration * 1000 * 60;
        let available_slots = [];

        // let ddd1 = moment('2020-08-09T07:37:46Z').tz("Asia/Kolkata").format();
        // console.log("dd1", ddd1);
        let ddd = moment("2020-07-23T10:30:00+05:30").tz("Asia/Kolkata").utc().format()
        // let offset = moment("2020-07-22T22:00:00-07:00").utcOffset();
        console.log("ddd", ddd);

        for (let i = 1; i <= total_slots; i++) {
            // let converted_date = getConvertedTime(startTime.valueOf() + (mill_sec_duration * i), timezone);
            let converted_date = moment(startTime.valueOf() + (mill_sec_duration * i)).tz(timezone).format()

            available_slots.push(converted_date);
        }

        return res.status(httpStatus.OK).send(available_slots);

    } catch (error) {
        console.error("error getAllFreeSlots", error);
        throw error;
    }
}

const addEvent = async (req, res) => {
    try {
        const { dateTime, timezone } = req.body;

        if (!dateTime || !timezone) {
            throw "Date or time or timezone not found";
        }

        // let eventDateTime = new Date(dateTime).toLocaleString("en-US", { timeZone: timezone });
        // let utcDate = new Date(eventDateTime).toUTCString();

        getUTCConvertedDateTime(dateTime)

        let timestamp = (new Date()).getTime()

        const docRef = db.collection('events').doc();

        await docRef.set({
            date: date,
            start_hours: start_hours,
        });

        return res.status(httpStatus.OK).send({
            eventDateTime,
            utcDate
        });
    } catch (error) {
        logger.error(error);
        res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

const getUTCConvertedDateTime = (date) => {
    // Multiply by 1000 because JS works in milliseconds instead of the UNIX seconds
    // var date = new Date(timestamp * 1000);

    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
    var day = date.getUTCDate();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();

    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}














const getFreeSlots = async (req, res) => {
    try {

        const { date, timezone } = req.body;

        if (!date || !timezone) {
            throw "Date or timezone not found";
        }

        let { start_hours, end_hours, duration } = config.app_config;

        let timeslots = [];

        while (start_hours != end_hours) {
            let availableTime = getTimeZonedDateTime(date + ' ' + start_hours, timezone);
            availableTime = new Date(availableTime).toISOString();
            timeslots.push(availableTime);
            console.log("timeslots", timeslots)
            start_hours = addMinutes(date, start_hours, duration);
        }

        // await getDataFromFirestore(timeslots);

        return res.status(httpStatus.OK).send(timeslots);
    } catch (error) {
        logger.error(error);
        res.status(httpStatus.BAD_REQUEST).send(error);
    }
};

function addMinutes(current_date, time, minutes) {
    let date = new Date(new Date(current_date + ' ' + time).getTime() + minutes * 60000);
    // let tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
    //     ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
    //     ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    console.log("date", date);
    return date;
}

const getDataFromFirestore = async (available_timeslots) => {
    const snapshot = await db.collection('events').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });

    return snapshot;
}


const getTimeZonedDateTime = (date, timezone) => {
    // console.log('data', date);
    return new Date(date).toLocaleString("en-US", { timeZone: timezone });
}


module.exports = {
    getFreeSlots,
    addEvent,
    getAllFreeSlots
};
