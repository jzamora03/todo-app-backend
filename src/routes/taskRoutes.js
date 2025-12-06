const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.route('/tasks')
  .get(getTasks)
  .post(createTask);

router.route('/tasks/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;