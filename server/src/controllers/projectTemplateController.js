const ProjectTemplate = require('../models/ProjectTemplate');

// @desc    Get all project templates
// @route   GET /api/project-templates
// @access  Private
const getTemplates = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const templates = await ProjectTemplate.find(query)
      .populate('createdBy', 'name')
      .sort({ isSystem: -1, name: 1 });

    res.json({ success: true, count: templates.length, templates });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single template
// @route   GET /api/project-templates/:id
// @access  Private
const getTemplate = async (req, res, next) => {
  try {
    const template = await ProjectTemplate.findById(req.params.id).populate('createdBy', 'name');
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project template
// @route   POST /api/project-templates
// @access  Private/Admin/ProjectManager
const createTemplate = async (req, res, next) => {
  try {
    const template = await ProjectTemplate.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project template
// @route   DELETE /api/project-templates/:id
// @access  Private/Admin
const deleteTemplate = async (req, res, next) => {
  try {
    const template = await ProjectTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    if (template.isSystem) {
      return res.status(403).json({ success: false, message: 'System templates cannot be deleted' });
    }
    await template.deleteOne();
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTemplates, getTemplate, createTemplate, deleteTemplate };
