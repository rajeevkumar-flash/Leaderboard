import React from 'react';

const UserSelector = ({ users, selectedUser, onUserSelect }) => {
  return (
    <div className="user-selector">
      <select 
        value={selectedUser?._id || ''}
        onChange={(e) => {
          const user = users.find(u => u._id === e.target.value);
          onUserSelect(user);
        }}
        className="user-dropdown"
      >
        <option value="">Select a user...</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} (Points: {user.totalPoints})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;