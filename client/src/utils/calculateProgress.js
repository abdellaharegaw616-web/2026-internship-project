// Calculate project progress based on tasks
export const calculateProjectProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

// Calculate task completion status
export const getTaskCompletionRate = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

// Calculate overdue tasks count
export const getOverdueTasksCount = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const now = new Date();
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return task.status !== 'Done' && dueDate < now;
  }).length;
};

// Calculate tasks by status
export const getTasksByStatus = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return {
      Todo: 0,
      'In Progress': 0,
      Review: 0,
      Done: 0,
    };
  }
  
  return {
    Todo: tasks.filter(t => t.status === 'Todo').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Review: tasks.filter(t => t.status === 'Review').length,
    Done: tasks.filter(t => t.status === 'Done').length,
  };
};

// Calculate team member performance
export const calculateMemberPerformance = (tasks, memberId) => {
  if (!tasks || tasks.length === 0) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      completionRate: 0,
    };
  }
  
  const memberTasks = tasks.filter(t => t.assignedTo?._id === memberId || t.assignedTo === memberId);
  const completed = memberTasks.filter(t => t.status === 'Done').length;
  const inProgress = memberTasks.filter(t => t.status === 'In Progress').length;
  const overdue = memberTasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return t.status !== 'Done' && dueDate < new Date();
  }).length;
  
  return {
    total: memberTasks.length,
    completed,
    inProgress,
    overdue,
    completionRate: memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0,
  };
};
