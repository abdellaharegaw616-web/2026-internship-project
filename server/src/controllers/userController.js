const User = require('../models/User');
const Department = require('../models/Department');
const asyncHandler = require('express-async-handler');
const csv = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const currentUser = req.user;
  
  let query = {};
  
  // Apply role filter if provided (Admin/PM only)
  if (role && (currentUser.role === 'Admin' || currentUser.role === 'ProjectManager')) {
    query.role = role;
  }
  
  // Apply search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  let users = await User.find(query).select('-password').sort({ createdAt: -1 });
  
  // Team Members get limited view - only name, avatar, department
  if (currentUser.role === 'TeamMember') {
    users = users.map(user => ({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      department: user.department,
      isActive: user.isActive
    }));
  }
  
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json(user);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const { name, email, role, department, phone, status } = req.body;
  
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.department = department !== undefined ? department : user.department;
  user.phone = phone || user.phone;
  user.status = status !== undefined ? status : user.status;
  
  const updatedUser = await user.save();
  
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    department: updatedUser.department,
    phone: updatedUser.phone,
    status: updatedUser.status,
    avatar: updatedUser.avatar,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc    Get user performance stats
// @route   GET /api/users/:id/performance
// @access  Private
const getUserPerformance = asyncHandler(async (req, res) => {
  const Task = require('../models/Task');
  
  const tasks = await Task.find({ assignedTo: req.params.id });
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    review: tasks.filter(t => t.status === 'Review').length,
    overdue: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return t.status !== 'Done' && dueDate < new Date();
    }).length,
  };
  
  stats.completionRate = tasks.length > 0 ? Math.round((stats.completed / tasks.length) * 100) : 0;
  
  res.json(stats);
});

// @desc    Import users from CSV/Excel
// @route   POST /api/users/import
// @access  Private/Admin
const importUsers = asyncHandler(async (req, res) => {
  const { file, format } = req.body;
  
  if (!file) {
    res.status(400);
    throw new Error('No file provided');
  }

  let users = [];
  
  if (format === 'csv') {
    // Parse CSV
    const results = [];
    const buffer = Buffer.from(file, 'base64');
    const stream = require('stream');
    const readable = new stream.Readable();
    readable.push(buffer);
    readable.push(null);
    
    readable
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        users = results;
        await processImport(users, res);
      })
      .on('error', (error) => {
        res.status(400);
        throw new Error('Error parsing CSV: ' + error.message);
      });
  } else if (format === 'excel') {
    // Parse Excel
    const buffer = Buffer.from(file, 'base64');
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    users = xlsx.utils.sheet_to_json(worksheet);
    await processImport(users, res);
  } else {
    res.status(400);
    throw new Error('Invalid format. Use csv or excel');
  }
});

const processImport = async (users, res) => {
  const bcrypt = require('bcryptjs');
  const results = {
    success: 0,
    failed: 0,
    errors: [],
  };

  for (const user of users) {
    try {
      const { name, email, role, department, phone } = user;
      
      // Validate required fields
      if (!name || !email) {
        results.failed++;
        results.errors.push({ email, error: 'Name and email are required' });
        continue;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        results.failed++;
        results.errors.push({ email, error: 'User already exists' });
        continue;
      }

      // Handle department - find by name if provided
      let departmentId = null;
      if (department && typeof department === 'string') {
        const dept = await Department.findOne({ name: department.trim() });
        departmentId = dept ? dept._id : null;
      }

      // Generate default password
      const defaultPassword = 'password123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);

      // Create user
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'TeamMember',
        department: departmentId,
        phone: phone || '',
      });

      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ email: user.email, error: error.message });
    }
  }

  res.json({
    success: true,
    message: `Import completed: ${results.success} users imported, ${results.failed} failed`,
    results,
  });
};

// @desc    Export users to CSV/Excel
// @route   GET /api/users/export
// @access  Private/Admin
const exportUsers = asyncHandler(async (req, res) => {
  const { format = 'csv' } = req.query;
  
  const users = await User.find({}).select('-password').sort({ name: 1 });
  
  const data = users.map(user => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Department: user.department || '',
    Phone: user.phone || '',
    Status: user.isActive ? 'Active' : 'Inactive',
    'Created At': user.createdAt.toISOString().split('T')[0],
  }));

  if (format === 'csv') {
    // Convert to CSV
    const json2csv = require('json2csv').parse;
    const csv = json2csv(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csv);
  } else if (format === 'excel') {
    // Convert to Excel
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    res.send(buffer);
  } else {
    res.status(400);
    throw new Error('Invalid format. Use csv or excel');
  }
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, phone } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields: name, email, password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Handle department (assuming department is sent as an ID or name, but since client sends "Select department" as empty, it might be empty string)
  let departmentId = null;
  if (department && department !== 'Select department') {
    // If it's sent as name, find it
    const dept = await Department.findOne({ name: department.trim() });
    if (dept) {
      departmentId = dept._id;
    } else {
      // If it's already an ObjectId, use it directly (basic check)
      if (department.match(/^[0-9a-fA-F]{24}$/)) {
        departmentId = department;
      }
    }
  }

  const user = await User.create({
    name,
    email,
    password, // User model will hash this automatically in pre('save')
    role: role || 'TeamMember',
    department: departmentId || '',
    phone: phone || '',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPerformance,
  importUsers,
  exportUsers,
};
