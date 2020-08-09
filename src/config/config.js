module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoose: {
        url: process.env.MONGODB_URL + (process.env.NODE_ENV === 'development' ? '-test' : ''),
        options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
    },
    jwt: {
      secret: process.env.JWT_SECRET
    },
    app_config: {
      start_hours: 10,
      end_hours: 17,
      duration: 30,
      timezone: 'America/Los_Angeles'
    },
    firestore: {
      collection: 'appointments'
    }
};