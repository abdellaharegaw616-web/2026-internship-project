import React from 'react';

const ProjectChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Progress</h3>
        <p className="text-gray-500 text-sm">No project data available</p>
      </div>
    );
  }

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Progress</h3>
      <div className="space-y-4">
        {data.map((project, index) => (
          <div key={project.id}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-4">
                {project.name}
              </span>
              <span className="text-sm font-semibold text-gray-800">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${project.progress}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectChart;
