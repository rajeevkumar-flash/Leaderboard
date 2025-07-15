import React from 'react';

const Leaderboard = ({ users, selectedUserId }) => {
  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className="leaderboard">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr 
              key={user._id} 
              className={selectedUserId === user._id ? 'selected' : ''}
            >
              <td className="rank">
                {getMedalEmoji(index + 1)} #{index + 1}
              </td>
              <td className="name">{user.name}</td>
              <td className="points">{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;