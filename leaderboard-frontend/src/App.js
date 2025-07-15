import React, { useState, useEffect } from 'react';
import './App.css';
import UserSelector from './components/UserSelector';
import Leaderboard from './components/Leaderboard';
import ClaimHistory from './components/ClaimHistory';
import AddUser from './components/AddUser';
import { userAPI, claimAPI } from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await claimAPI.getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUser) {
      alert('Please select a user first!');
      return;
    }

    setLoading(true);
    try {
      const response = await claimAPI.claimPoints(selectedUser._id);
      const { pointsClaimed, user } = response.data;
      
      // Show claim result
      setClaimResult({
        userName: user.name,
        pointsClaimed,
        newTotal: user.totalPoints
      });

      // Clear result after 3 seconds
      setTimeout(() => setClaimResult(null), 3000);

      // Refresh data
      await fetchUsers();
      await fetchHistory();
    } catch (error) {
      console.error('Error claiming points:', error);
      alert('Error claiming points!');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = async () => {
    await fetchUsers();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏆 Leaderboard System</h1>
      </header>
      
      <div className="container">
        <div className="left-panel">
          <div className="section">
            <h2>Select User & Claim Points</h2>
            <UserSelector 
              users={users}
              selectedUser={selectedUser}
              onUserSelect={setSelectedUser}
            />
            
            <button 
              className="claim-button"
              onClick={handleClaimPoints}
              disabled={loading || !selectedUser}
            >
              {loading ? 'Claiming...' : 'Claim Points'}
            </button>

            {claimResult && (
              <div className="claim-result">
                <div className="claim-animation">
                  +{claimResult.pointsClaimed} Points!
                </div>
                <p>{claimResult.userName} now has {claimResult.newTotal} points!</p>
              </div>
            )}
          </div>

          <div className="section">
            <h2>Add New User</h2>
            <AddUser onUserAdded={handleUserAdded} />
          </div>
        </div>

        <div className="right-panel">
          <div className="section">
            <h2>Leaderboard</h2>
            <Leaderboard users={users} selectedUserId={selectedUser?._id} />
          </div>

          <div className="section">
            <h2>Recent Claims</h2>
            <ClaimHistory history={history} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;