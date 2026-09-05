const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const Project = require('../models/Project');

// Helper to hash token
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// @desc    Invite a user
// @route   POST /api/invitations
// @access  Private (SuperAdmin, Admin, ProjectManager)
const inviteUser = async (req, res, next) => {
  try {
    const { email, role, department, project } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, message: 'Email and role are required' });
    }

    // No one can invite a SuperAdmin. SuperAdmin role is transferred only.
    if (role === 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Cannot invite a user as SuperAdmin. Use the transfer feature instead.' });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Role hierarchy checks
    if (req.user.role === 'ProjectManager') {
      if (role !== 'TeamMember') {
        return res.status(403).json({ success: false, message: 'Project Managers can only invite Team Members' });
      }
      if (!project) {
        return res.status(400).json({ success: false, message: 'Project is required for Project Manager invitations' });
      }
      // Check if PM actually owns/manages this project
      const proj = await Project.findById(project);
      if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });
      
      const isOwner = proj.owner.toString() === req.user._id.toString();
      const isMember = proj.members.some(m => m.user.toString() === req.user._id.toString() && m.role === 'ProjectManager');
      if (!isOwner && !isMember) {
        return res.status(403).json({ success: false, message: 'Not authorized to invite to this project' });
      }
    } else if (req.user.role === 'Admin') {
      if (role === 'SuperAdmin' || role === 'Admin') {
        return res.status(403).json({ success: false, message: 'Admins cannot invite SuperAdmins or Admins' });
      }
    }

    // Check for existing pending invitation and revoke it if resending
    const existingInvite = await Invitation.findOne({ email, status: 'Pending' });
    if (existingInvite) {
      existingInvite.status = 'Revoked';
      await existingInvite.save();
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);

    // Create invitation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const invitation = await Invitation.create({
      email,
      role,
      department: department || undefined,
      project: project || undefined,
      tokenHash,
      status: 'Pending',
      invitedBy: req.user._id,
      expiresAt,
    });

    // In a real app, we would send an email here using emailService.
    // sendInvitationEmail(email, token, req.user.name);

    res.status(201).json({
      success: true,
      message: 'Invitation created successfully',
      data: {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        // Send token ONLY ONCE in response for development/testing
        // In production, NEVER send token in API response, only via email
        inviteToken: token,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invitations
// @route   GET /api/invitations
// @access  Private (SuperAdmin, Admin, ProjectManager)
const getInvitations = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === 'ProjectManager') {
      query.invitedBy = req.user._id; // PMs only see invites they sent
    }

    const invitations = await Invitation.find(query)
      .populate('invitedBy', 'name email')
      .populate('department', 'name')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: invitations.length, data: invitations });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke invitation
// @route   PUT /api/invitations/:id/revoke
// @access  Private
const revokeInvitation = async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    if (req.user.role === 'ProjectManager' && invitation.invitedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to revoke this invitation' });
    }

    if (invitation.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Cannot revoke a ${invitation.status} invitation` });
    }

    invitation.status = 'Revoked';
    await invitation.save();

    res.json({ success: true, message: 'Invitation revoked successfully', data: invitation });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete invitation
// @route   DELETE /api/invitations/:id
// @access  Private
const deleteInvitation = async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    if (req.user.role === 'ProjectManager' && invitation.invitedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this invitation' });
    }

    await Invitation.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Invitation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify invitation token (Public)
// @route   GET /api/invitations/verify/:token
// @access  Public
const verifyInvitation = async (req, res, next) => {
  try {
    const tokenHash = hashToken(req.params.token);
    
    const invitation = await Invitation.findOne({ tokenHash, status: 'Pending' })
      .populate('project', 'title')
      .populate('department', 'name');

    if (!invitation) {
      return res.status(400).json({ success: false, message: 'Invalid or expired invitation token' });
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'Expired';
      await invitation.save();
      return res.status(400).json({ success: false, message: 'Invitation has expired' });
    }

    res.json({
      success: true,
      data: {
        email: invitation.email,
        role: invitation.role,
        projectName: invitation.project?.title,
        departmentName: invitation.department?.name,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept invitation & create account
// @route   POST /api/invitations/accept/:token
// @access  Public
const acceptInvitation = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    
    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Name and password are required' });
    }

    const tokenHash = hashToken(req.params.token);
    const invitation = await Invitation.findOne({ tokenHash, status: 'Pending' });

    if (!invitation) {
      return res.status(400).json({ success: false, message: 'Invalid or expired invitation token' });
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'Expired';
      await invitation.save();
      return res.status(400).json({ success: false, message: 'Invitation has expired' });
    }

    // Create user
    const user = await User.create({
      name,
      email: invitation.email,
      password,
      role: invitation.role,
      department: invitation.department,
    });

    // If project was specified, assign user to project
    if (invitation.project) {
      await Project.findByIdAndUpdate(invitation.project, {
        $push: { members: { user: user._id, role: invitation.role } }
      });
    }

    // Mark accepted
    invitation.status = 'Accepted';
    await invitation.save();

    // Send token for immediate login
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  inviteUser,
  getInvitations,
  revokeInvitation,
  deleteInvitation,
  verifyInvitation,
  acceptInvitation
};
