const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Get all skills (with filtering)
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res, next) => {
  try {
    const { userId, category, isCertification, expiring } = req.query;
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';

    let query = {};
    
    // Non-admin users can only see their own skills
    if (!isAdmin) {
      query.user = req.user._id;
    } else if (userId) {
      query.user = userId;
    }

    if (category) {
      query.category = category;
    }

    if (isCertification !== undefined) {
      query.isCertification = isCertification === 'true';
    }

    let skills = await Skill.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    // Filter expiring certifications on the client side
    if (expiring === 'true') {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      skills = skills.filter(skill => {
        if (!skill.isCertification || !skill.expiryDate) return false;
        const expiry = new Date(skill.expiryDate);
        return expiry > today && expiry <= thirtyDaysFromNow;
      });
    }

    res.json({ success: true, skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Private
const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('user', 'name email avatar');

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && skill.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const {
      name,
      category,
      proficiency,
      isCertification,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      notes,
    } = req.body;

    const skill = await Skill.create({
      user: req.user._id,
      name,
      category,
      proficiency,
      isCertification: isCertification || false,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      notes,
    });

    const populatedSkill = await Skill.findById(skill._id)
      .populate('user', 'name email avatar');

    res.status(201).json({ success: true, skill: populatedSkill });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const {
      name,
      category,
      proficiency,
      isCertification,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      notes,
    } = req.body;

    skill.name = name || skill.name;
    skill.category = category || skill.category;
    skill.proficiency = proficiency || skill.proficiency;
    skill.isCertification = isCertification !== undefined ? isCertification : skill.isCertification;
    skill.issuer = issuer !== undefined ? issuer : skill.issuer;
    skill.issueDate = issueDate !== undefined ? issueDate : skill.issueDate;
    skill.expiryDate = expiryDate !== undefined ? expiryDate : skill.expiryDate;
    skill.credentialId = credentialId !== undefined ? credentialId : skill.credentialId;
    skill.credentialUrl = credentialUrl !== undefined ? credentialUrl : skill.credentialUrl;
    skill.notes = notes !== undefined ? notes : skill.notes;

    await skill.save();

    const populatedSkill = await Skill.findById(skill._id)
      .populate('user', 'name email avatar');

    res.json({ success: true, skill: populatedSkill });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await skill.deleteOne();

    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expiring certifications
// @route   GET /api/skills/expiring
// @access  Private
const getExpiringCertifications = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    let query = { isCertification: true, expiryDate: { $ne: null } };
    
    if (!isAdmin) {
      query.user = req.user._id;
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    query.expiryDate = {
      $gt: today,
      $lte: thirtyDaysFromNow,
    };

    const skills = await Skill.find(query)
      .populate('user', 'name email avatar')
      .sort({ expiryDate: 1 });

    res.json({ success: true, skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill statistics
// @route   GET /api/skills/stats
// @access  Private
const getSkillStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    let query = isAdmin ? {} : { user: req.user._id };

    const stats = {
      total: await Skill.countDocuments(query),
      certifications: await Skill.countDocuments({ ...query, isCertification: true }),
      technical: await Skill.countDocuments({ ...query, category: 'Technical' }),
      softSkills: await Skill.countDocuments({ ...query, category: 'Soft Skills' }),
      languages: await Skill.countDocuments({ ...query, category: 'Language' }),
    };

    // Get expiring certifications count
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    stats.expiringSoon = await Skill.countDocuments({
      ...query,
      isCertification: true,
      expiryDate: {
        $gt: today,
        $lte: thirtyDaysFromNow,
      },
    });

    // Get expired certifications count
    stats.expired = await Skill.countDocuments({
      ...query,
      isCertification: true,
      expiryDate: { $lt: today },
    });

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getExpiringCertifications,
  getSkillStats,
};
