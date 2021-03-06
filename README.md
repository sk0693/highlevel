# highlevel

## Installing

1. Clone the repository using :

```bash
git clone https://github.com/sk0693/highlevel.git
```

2. Change the repository directory :

```bash
cd highlevel
```

3. Install the needed node packges/modules :

```bash
npm install
```

4. Start the development server :

```bash
npm start
```

## APIs Documentation.

### 1.) Get all available slots for the given date

```http
POST :  /api/v1/appointments/free-slots
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `date`     | `String` | **Required**. |
| `timezone` | `String` | **Required**. |

#### Responses

```javascript
[
    "2020-07-22T22:30:00-07:00",
    "2020-07-22T23:30:00-07:00",
    "2020-07-23T00:00:00-07:00",
    "2020-07-23T00:30:00-07:00",
    "2020-07-23T01:00:00-07:00",
    "2020-07-23T01:30:00-07:00",
    "2020-07-23T02:00:00-07:00",
    "2020-07-23T02:30:00-07:00",
    "2020-07-23T03:00:00-07:00",
    "2020-07-23T03:30:00-07:00",
    "2020-07-23T04:00:00-07:00",
    "2020-07-23T04:30:00-07:00"
    ...
]
```

### 2.) Book an Appointment

```http
POST :  /api/v1/appointments/bookAppointment
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `dateTime` | `String` | **Required**. |
| `timezone` | `String` | **Required**. |


#### Responses

```javascript
{
    "message": "Appointment booked succesfully",
    "data": {
        "dateTime": "2020-07-23T11:30:00+05:30",
        "utcDateTime": 1595484000000
    }
}
```

### 3.) Get Booked Appointments in Between 2 dates

```http
POST :  /api/v1/appointments/getAppointmentsInBetweenDates
```

| Parameter   | Type     | Description   |
| :---------- | :------- | :------------ |
| `startDate` | `String` | **Required**. |
| `endDate`   | `String` | **Required**. |
| `timezone`  | `String` | **Optional**. |

#### Responses

```javascript
{
    "startDate": "2020-07-22T11:30:00-07:00",
    "endDate": "2020-07-23T11:30:00-07:00",
    "timezone": "America/Los_Angeles",
    "booked_timestamp": [
        "2020-07-22T22:00:00-07:00",
        "2020-07-22T23:00:00-07:00"
    ]
}
```
