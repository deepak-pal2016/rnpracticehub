/* eslint-disable no-unused-vars */
const admin = require('../config/jsonkey/firebase.json')

const sendNotification = async(token,title,body) => {
    try {
        await admin.messaging().send({
            token:token,
            notification:{
                title,
                body
            },
            data:{
                type:'task'
            }
        })
        
    } catch (error) {
        console.log('notifciaon error', error);
        
    }
}

module.exports = sendNotification;