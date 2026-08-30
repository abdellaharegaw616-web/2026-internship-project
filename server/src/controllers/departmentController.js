const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('head', 'name email avatar')
      .sort({ name: 1 });

    // Get member count for each department
    const departmentsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const memberCount = await User.countDocuments({ department: dept._id, isActive: true });
        return {
          ...dept.toObject(),
          memberCount,
        };
      })
    );

    res.json({ success: true, departments: departmentsWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
const getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('head', 'name email avatar');

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const members = await User.find({ department: department._id, isActive: true })
      .select('name email role avatar');

    const memberCount = members.length;

    res.json({ success: true, department: { ...department.toObject(), memberCount, members } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin only)
const createDepartment = async (req, res, next) => {
  try {
    const { name, description, head } = req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ success: false, message: 'Department already exists' });
    }

    // Validate head exists if provided
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser) {
        return res.status(400).json({ success: false, message: 'Department head not found' });
      }
    }

    const department = await Department.create({ name, description, head });

    // Update head user's department
    if (head) {
      await User.findByIdAndUpdate(head, { department: name });
    }

    const populatedDepartment = await Department.findById(department._id)
      .populate('head', 'name email avatar');

    res.status(201).json({ success: true, department: populatedDepartment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin only)
const updateDepartment = async (req, res, next) => {
  try {
    const { name, description, head } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Update head
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser) {
        return res.status(400).json({ success: false, message: 'Department head not found' });
      }
      await User.findByIdAndUpdate(head, { department: department._id });
    }

    department.name = name || department.name;
    department.description = description !== undefined ? description : department.description;
    department.head = head !== undefined ? head : department.head;
    await department.save();

    const populatedDepartment = await Department.findById(department._id)
      .populate('head', 'name email avatar');

    res.json({ success: true, department: populatedDepartment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Check if department has members
    const memberCount = await User.countDocuments({ department: department._id, isActive: true });
    if (memberCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete department with ${memberCount} active members. Please reassign members first.` 
      });
    }

    // Soft delete
    department.isActive = false;
    await department.save();

    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
