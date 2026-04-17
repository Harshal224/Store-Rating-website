import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth'; // assuming same utils folder
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboard() {
      const token = getToken();
      if (!token) {
        // No token, redirect to login
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('http://localhost:5000/api/owner/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setStoreData(data.store);
        } else {
          setError(data.message || 'Failed to load dashboard');
          if (res.status === 403) {
            // maybe token expired or wrong role
            navigate('/login');
          }
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }

      setLoading(false);
    }

    fetchDashboard();
  }, [navigate]);

  if (loading) return <div className="text-center my-4">Loading dashboard...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;
  if (!storeData) return <div className="alert alert-info my-4">No store data found.</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">{storeData.name} Dashboard</h2>
      <p><strong>Address:</strong> {storeData.address}</p>
      <p><strong>Average Rating:</strong> {storeData.averageRating.toFixed(2)}</p>

      <h4 className="mt-4">Users who rated your store:</h4>
      {storeData.usersWhoRated.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {storeData.usersWhoRated.map(user => (
              <tr key={user.userId}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
