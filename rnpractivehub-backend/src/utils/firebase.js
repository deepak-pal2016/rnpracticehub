/* eslint-disable no-unused-vars */
const admin = require('firebase-admin')
const serviceAccount = require('../config/jsonkey/firebase.json')

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
})

module.exports = admin;