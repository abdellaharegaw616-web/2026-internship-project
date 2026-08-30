const DashboardLayout = require('../models/DashboardLayout');

// @desc    Get user's dashboard layout
// @route   GET /api/dashboard-layout
// @access  Private
const getDashboardLayout = async (req, res, next) => {
  try {
    let layout = await DashboardLayout.findOne({ user: req.user._id });
    
    // Create default layout if none exists
    if (!layout) {
      layout = await DashboardLayout.create({
        user: req.user._id,
        widgets: [
          { id: 'stats', type: 'stats', title: 'Statistics', position: { x: 0, y: 0, w: 6, h: 2 } },
          { id: 'tasks', type: 'tasks', title: 'My Tasks', position: { x: 6, y: 0, w: 6, h: 2 } },
          { id: 'projects', type: 'projects', title: 'Projects', position: { x: 0, y: 2, w: 4, h: 3 } },
          { id: 'team', type: 'team', title: 'Team Activity', position: { x: 4, y: 2, w: 4, h: 3 } },
          { id: 'activity', type: 'activity', title: 'Recent Activity', position: { x: 8, y: 2, w: 4, h: 3 } },
        ],
      });
    }

    res.json({ success: true, layout });
  } catch (error) {
    next(error);
  }
};

// @desc    Update dashboard layout
// @route   PUT /api/dashboard-layout
// @access  Private
const updateDashboardLayout = async (req, res, next) => {
  try {
    const { widgets } = req.body;
    
    let layout = await DashboardLayout.findOne({ user: req.user._id });
    if (!layout) {
      layout = await DashboardLayout.create({
        user: req.user._id,
        widgets: widgets || [],
      });
    } else {
      layout.widgets = widgets || [];
      await layout.save();
    }

    res.json({ success: true, layout });
  } catch (error) {
    next(error);
  }
};

// @desc    Add widget to dashboard
// @route   POST /api/dashboard-layout/widgets
// @access  Private
const addWidget = async (req, res, next) => {
  try {
    const { type, title, position, config } = req.body;
    
    let layout = await DashboardLayout.findOne({ user: req.user._id });
    if (!layout) {
      layout = await DashboardLayout.create({
        user: req.user._id,
        widgets: [],
      });
    }

    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      title,
      position: position || { x: 0, y: 0, w: 3, h: 2 },
      config: config || {},
      isVisible: true,
    };

    layout.widgets.push(newWidget);
    await layout.save();

    res.status(201).json({ success: true, widget: newWidget });
  } catch (error) {
    next(error);
  }
};

// @desc    Update widget
// @route   PUT /api/dashboard-layout/widgets/:widgetId
// @access  Private
const updateWidget = async (req, res, next) => {
  try {
    const { position, title, config, isVisible } = req.body;
    
    const layout = await DashboardLayout.findOne({ user: req.user._id });
    if (!layout) {
      return res.status(404).json({ success: false, message: 'Dashboard layout not found' });
    }

    const widget = layout.widgets.id(req.params.widgetId);
    if (!widget) {
      return res.status(404).json({ success: false, message: 'Widget not found' });
    }

    if (position !== undefined) widget.position = position;
    if (title !== undefined) widget.title = title;
    if (config !== undefined) widget.config = config;
    if (isVisible !== undefined) widget.isVisible = isVisible;

    await layout.save();

    res.json({ success: true, widget });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete widget
// @route   DELETE /api/dashboard-layout/widgets/:widgetId
// @access  Private
const deleteWidget = async (req, res, next) => {
  try {
    const layout = await DashboardLayout.findOne({ user: req.user._id });
    if (!layout) {
      return res.status(404).json({ success: false, message: 'Dashboard layout not found' });
    }

    const widget = layout.widgets.id(req.params.widgetId);
    if (!widget) {
      return res.status(404).json({ success: false, message: 'Widget not found' });
    }

    layout.widgets.pull(req.params.widgetId);
    await layout.save();

    res.json({ success: true, message: 'Widget deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset dashboard layout to default
// @route   POST /api/dashboard-layout/reset
// @access  Private
const resetDashboardLayout = async (req, res, next) => {
  try {
    await DashboardLayout.deleteOne({ user: req.user._id });
    
    const layout = await DashboardLayout.create({
      user: req.user._id,
      widgets: [
        { id: 'stats', type: 'stats', title: 'Statistics', position: { x: 0, y: 0, w: 6, h: 2 } },
        { id: 'tasks', type: 'tasks', title: 'My Tasks', position: { x: 6, y: 0, w: 6, h: 2 } },
        { id: 'projects', type: 'projects', title: 'Projects', position: { x: 0, y: 2, w: 4, h: 3 } },
        { id: 'team', type: 'team', title: 'Team Activity', position: { x: 4, y: 2, w: 4, h: 3 } },
        { id: 'activity', type: 'activity', title: 'Recent Activity', position: { x: 8, y: 2, w: 4, h: 3 } },
      ],
    });

    res.json({ success: true, layout });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardLayout,
  updateDashboardLayout,
  addWidget,
  updateWidget,
  deleteWidget,
  resetDashboardLayout,
};
