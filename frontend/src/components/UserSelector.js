import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/api';

const UserSelector = ({ selectedUserId, onUserSelect, showAll = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="form-group">
      <label>選擇使用者:</label>
      <select
        value={selectedUserId || ''}
        onChange={(e) => onUserSelect(e.target.value)}
      >
        <option value="">請選擇使用者</option>
        {showAll && <option value="all">所有使用者</option>}
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;