/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const Task = require('../models/task');
const User = require('../models/users');
const mongoose = require('mongoose');
const sendNotification = require('../utils/sendnotification');
const Notification = require('../models/notification');

const getPriorityColor = priority => {
  switch (priority) {
    case 'Low':
      return '#4CAF50'; // green
    case 'Medium':
      return '#FFC107'; // yellow
    case 'High':
      return '#F44336'; // red
    default:
      return '#000';
  }
};

const addTask = async (req, res) => {
  try {
    const {
      title,
      dueDate,
      description,
      priority,
      userId,
      category,
      assignedBy,
    } = req.body;
    const priorityColor = getPriorityColor(req.body.priority);
    const tasks = await Task.create({
      title,
      dueDate,
      description,
      priority,
      category,
      priorityColor,
      assignedBy: new mongoose.Types.ObjectId(assignedBy),
      userId: new mongoose.Types.ObjectId(userId),
    });

    const assignedUser = await User.findById(userId);
    const assigner = await User.findById(assignedBy);

    if (tasks) {
      await Notification.create({
        userId: assignedUser?._id,
        SenderId: assigner?._id,
        title: 'New Task Assigned',
        message: `${assigner?.name} assigned you a task`,
        type: 'task',
        taskId: tasks?._id,
      });

      if (assignedUser?.fcmtoken) {
        await sendNotification(
          assignedUser.fcmtoken,
          'New Task Assigned',
          `${assigner?.name} assigned you a task: ${title}`,
        );
      }
    }

    if (tasks) {
      res.status(200).json({
        status: true,
        message: 'task create successfully',
        data: tasks,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'something went wrong, please try again',
        data: [],
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const getUserTask = async (req, res) => {
  const { userid } = req.body;
  try {
    const alltask = await Task.find({
      $or: [
        { assignedBy: new mongoose.Types.ObjectId(userid) },
        { userId: new mongoose.Types.ObjectId(userid) },
      ],
    })
      .populate('assignedBy', 'name')
      .populate('userId', 'name');

    if (alltask) {
      res.status(200).json({
        status: true,
        message: 'All task list found..',
        data: alltask,
      });
    }

    if (!alltask) {
      res.status(404).json({
        status: false,
        message: 'Data not found..',
        data: [],
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const completetask = async (req, res) => {
  try {
    const { taskId, remarks, taskstatus, taskdate } = req.body;
    const userid = req.user._id;
    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        status: taskstatus,
        completedBy: new mongoose.Types.ObjectId(userid),
        isCompleted: taskstatus === 'completed' ? true : false,
        completedAt: taskdate,
        remarks: remarks,
      },
      { returnDocument: 'after', runValidators: true },
    );
    if (task) {
      res.status(200).json({
        status: true,
        message: 'Task marked as completed',
        data: task,
      });
      const assigner = await User.findById(task.assignedBy);
      if (assigner) {
        await sendNotification(
          assigner?.fcmtoken,
          'Task Completed',
          `${req.user.name} completed the task ${task.title}`,
        );
        // console.log(assigner, 'caalignt his fuctnion');
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};

const deletetaskbyid = async (req, res) => {
  try {
    const { taskid } = req.params;
    const deletetask = await Task.deleteOne({ _id: taskid });
    if (deletetask.deletedCount > 0) {
      return res.status(200).json({
        status: true,
        message: 'Task delete successfully..',
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Task not found',
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};

module.exports = { addTask, getUserTask, completetask, deletetaskbyid };
