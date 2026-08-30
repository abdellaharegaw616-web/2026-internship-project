import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import userService from '../../services/userService';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TeamMember',
    department: '',
    phone: '',
    status: 'Active',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'TeamMember',
        department: user.department || '',
        phone: user.phone || '',
        status: user.status || 'Active',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await userService.updateUser(user._id, formData);
      } else {
        // For new users, password is required
        if (!formData.password) {
          alert('Password is required for new users');
          return;
        }
        await userService.register(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.message || 'Failed to save user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter full name"
        required
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter email address"
        required
      />
      {!user && (
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
      )}
      {user && (
        <Input
          label="New Password (leave blank to keep current)"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password"
        />
      )}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="Admin">Admin</option>
          <option value="ProjectManager">Project Manager</option>
          <option value="TeamMember">Team Member</option>
        </select>
      </div>
      <Input
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        placeholder="Enter department"
      />
      <Input
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter phone number"
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary">
          {user ? 'Update Member' : 'Add Member'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
