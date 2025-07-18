import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const PasswordForm = ({ onSave, onCancel, editData = null }) => {
  const [formData, setFormData] = useState({
    website: editData?.website || '',
    username: editData?.username || '',
    password: editData?.password || '',
    notes: editData?.notes || ''
  });

  const handleSubmit = () => {
    // Validate form
    if (!formData.website || !formData.username || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setFormData({ ...formData, password });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {editData ? 'Edit Password' : 'Add New Password'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Website *"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Username/Email *"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="relative">
          <input
            type="text"
            placeholder="Password *"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full pr-10"
          />
          <button
            onClick={generatePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
            title="Generate Password"
          >
            🎲
          </button>
        </div>
        
        <textarea
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
          rows="3"
        />
        
        <div className="md:col-span-2 flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editData ? 'Update' : 'Save'} Password
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordForm;