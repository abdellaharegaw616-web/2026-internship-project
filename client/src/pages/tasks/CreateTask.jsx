import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';
import userService from '../../services/userService';
import Button from '../../components/common/Button';
import TaskForm from '../../components/task/TaskForm';

const CreateTask = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsData, usersData] = await Promise.all([
        projectService.getAllProjects(),
        userService.getAllUsers(),
      ]);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/tasks')}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to Tasks
        </button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
        <TaskForm
          projects={projects}
          users={users}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
        />
      </div>
    </div>
  );
};

export default CreateTask;
