const express = require('express');
const { verifyToken, isTeacher } = require('../middleware/authMiddleware');
const Class = require('../models/Class');

const router = express.Router();

// Get all classes
router.get('/', verifyToken, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.userId }).populate('students', 'name email');
    res.status(200).json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create class
router.post('/', verifyToken, isTeacher, async (req, res) => {
  try {
    const { name, description, subjects } = req.body;

    const classDoc = await Class.create({
      name,
      description,
      subjects,
      teacher: req.userId
    });

    res.status(201).json({ success: true, class: classDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update class
router.put('/:id', verifyToken, isTeacher, async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, class: classDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add student to class
router.post('/:id/add-student', verifyToken, isTeacher, async (req, res) => {
  try {
    const { studentId } = req.body;
    const classDoc = await Class.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: studentId } },
      { new: true }
    );
    res.status(200).json({ success: true, class: classDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
