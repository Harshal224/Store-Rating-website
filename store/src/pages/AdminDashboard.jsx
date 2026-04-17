import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-4">Loading dashboard...</div>;

  return (
    <>
      <div className="container my-4">
        <h2>Dashboard</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5>Total Users</h5>
                <h3>{stats.totalUsers}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5>Total Stores</h5>
                <h3>{stats.totalStores}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5>Total Ratings</h5>
                <h3>{stats.totalRatings}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
