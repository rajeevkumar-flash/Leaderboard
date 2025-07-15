import React from 'react';

const ClaimHistory = ({ history }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="claim-history">
      {history.length === 0 ? (
        <p className="no-history">No claims yet</p>
      ) : (
        <div className="history-list">
          {history.slice(0, 10).map((claim) => (
            <div key={claim._id} className="history-item">
              <div className="history-user">{claim.userName}</div>
              <div className="history-points">+{claim.pointsClaimed} points</div>
              <div className="history-date">{formatDate(claim.claimedAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimHistory;