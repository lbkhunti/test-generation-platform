const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    enum: ['8', '9', '10'],
    unique: true
  },
  
  description: {
    type: String,
    trim: true
  },
  
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  studentCount: {
    type: Number,
    default: 0
  },
  
  // Subjects taught in this class
  subjects: {
    type: [String],
    enum: ['Mathematics', 'Science', 'Both'],
    default: ['Both']
  },
  
  // Tests assigned to this class
  assignedTests: [{
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    assignedAt: Date
  }],
  
  // Class schedule/timing
  schedule: {
    day: String,
    time: String
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index
classSchema.index({ teacher: 1, isActive: 1 });

module.exports = mongoose.model('Class', classSchema);
