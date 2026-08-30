import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Export to PDF
export const exportToPDF = (data, filename, title) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  let yPosition = 45;
  const lineHeight = 10;
  
  // Add data
  data.forEach((item, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(10);
    Object.entries(item).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const text = `${key}: ${value}`;
        doc.text(text.substring(0, 80), 14, yPosition);
        yPosition += lineHeight;
      }
    });
    
    yPosition += 5;
  });
  
  doc.save(`${filename}.pdf`);
};

// Export to Excel
export const exportToExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Export tasks to PDF
export const exportTasksToPDF = (tasks, projectName = 'All Tasks') => {
  const data = tasks.map(task => ({
    Title: task.title,
    Status: task.status,
    Priority: task.priority,
    AssignedTo: task.assignedTo?.name || 'Unassigned',
    DueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
    Project: task.project?.name || 'No project',
  }));
  
  exportToPDF(data, `tasks-${Date.now()}`, projectName);
};

// Export tasks to Excel
export const exportTasksToExcel = (tasks, filename = 'tasks') => {
  const data = tasks.map(task => ({
    Title: task.title,
    Status: task.status,
    Priority: task.priority,
    AssignedTo: task.assignedTo?.name || 'Unassigned',
    DueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
    Project: task.project?.name || 'No project',
    Description: task.description || '',
  }));
  
  exportToExcel(data, `${filename}-${Date.now()}`);
};

// Export projects to PDF
export const exportProjectsToPDF = (projects) => {
  const data = projects.map(project => ({
    Name: project.name || project.title,
    Status: project.status,
    Priority: project.priority,
    StartDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No start date',
    EndDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No end date',
    Members: project.members?.length || 0,
    Progress: project.progress || 0,
  }));
  
  exportToPDF(data, `projects-${Date.now()}`, 'Projects Report');
};

// Export projects to Excel
export const exportProjectsToExcel = (projects, filename = 'projects') => {
  const data = projects.map(project => ({
    Name: project.name || project.title,
    Status: project.status,
    Priority: project.priority,
    StartDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No start date',
    EndDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No end date',
    Members: project.members?.length || 0,
    Progress: project.progress || 0,
    Description: project.description || '',
  }));
  
  exportToExcel(data, `${filename}-${Date.now()}`);
};

// Export users to PDF
export const exportUsersToPDF = (users) => {
  const data = users.map(user => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Department: user.department || 'Not specified',
    Phone: user.phone || 'Not specified',
    Status: user.status || 'Active',
  }));
  
  exportToPDF(data, `users-${Date.now()}`, 'Team Members Report');
};

// Export users to Excel
export const exportUsersToExcel = (users, filename = 'users') => {
  const data = users.map(user => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Department: user.department || 'Not specified',
    Phone: user.phone || 'Not specified',
    Status: user.status || 'Active',
  }));
  
  exportToExcel(data, `${filename}-${Date.now()}`);
};
