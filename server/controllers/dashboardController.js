import Task from '../models/Task.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = { assignedTo: req.user._id };
    }

    const totalTasks = await Task.countDocuments(query);
    const completedTasks = await Task.countDocuments({ ...query, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ ...query, status: 'Todo' });
    const inProgressTasks = await Task.countDocuments({ ...query, status: 'In Progress' });
    
    // Calculate overdue (dueDate < now && status != completed)
    const overdueTasks = await Task.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' },
    });

    const recentTasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('project', 'name')
      .populate('assignedTo', 'name');

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
