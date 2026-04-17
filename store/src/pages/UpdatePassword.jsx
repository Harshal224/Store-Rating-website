import React, { useState } from 'react';
import { getToken } from '../utils/auth';

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    try {
      const res = await fetch('http://localhost:5000/api/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        {/* Card Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
            color: 'white',
            padding: '16px'
          }}
        >
          <h5 className="mb-0 fw-bold">Update Password</h5>
          <small className="text-light">Keep your account secure</small>
        </div>

        {/* Card Body */}
        <div className="card-body">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{
                background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
