/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const { addUser,getUser, loginUser,logout } = require('../controllers/userController');
const {addTask,getUserTask,completetask} = require('../controllers/taskController')
const {sendMessage,getuserchats} = require('../controllers/chatController')
const {uploadAudio} = require('../controllers/uploadController')
const upload  = require('../middleware/upload')
router.post('/adduser', addUser);
router.post('/getuser',authMiddleware,getUser)
router.post('/addtask',authMiddleware,addTask)
router.post('/getusertask',authMiddleware,getUserTask)
router.post('/completetask',authMiddleware,completetask)
router.post('/sendmessage',authMiddleware,sendMessage)
router.post('/getuserchats',authMiddleware,getuserchats)
router.post('/loginuser', loginUser)
router.post('/logoutuser', authMiddleware, logout);
router.post('/upload', upload.single('file'), uploadAudio);

module.exports = router;
