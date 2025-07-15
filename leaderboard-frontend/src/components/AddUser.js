import React, { useState } from 'react';
import { userAPI } from '../services/api';

const AddUser = ({ onUserAdded }) => {
  const [newUserName, setNewUserName] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUserName.trim()) {
      alert('Please enter a user name');
      return;
    }

    setAdding(true);
    try {
      await userAPI.addUser(newUserName.trim());
      setNewUserName('');
      onUserAdded();
      alert('User added successfully!');
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Error adding user');
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleAddUser} className="add-user-form">
      <input
        type="text"
        placeholder="Enter user name"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        className="user-input"
      />
      <button type="submit" disabled={adding} className="add-button">
        {adding ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
};

export default AddUser;