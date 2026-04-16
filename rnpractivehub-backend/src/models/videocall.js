/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

const callSchema = new mongoose.Schema({
    callerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },  receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
     status: {
      type: String,
      enum: ['missed', 'accepted', 'rejected', 'ended'],
      default: 'missed',
    },

    startedAt: Date,
    endedAt: Date,

    duration: Number, // seconds
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Videocall', callSchema)