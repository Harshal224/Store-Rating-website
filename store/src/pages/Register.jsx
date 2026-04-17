import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
  name: '',
  email: '',
  address: '',
  password: '',
  role: ''
});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registered successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="d-flex m-4 justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill text-success fs-1"></i>
          <h3 className="mt-2 text-success fw-bold">Create Account</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Fill in your details to register
          </p>
        </div>

        {/* Alerts */}
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={60}
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <textarea
              name="address"
              className="form-control"
              value={form.address}
              onChange={handleChange}
              maxLength={400}
              placeholder="Enter your address"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              pattern="(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}"
              title="8-16 chars, 1 uppercase, 1 special character"
              placeholder="Create a password"
            />
            <small className="text-muted">
              Must be 8-16 characters with at least one uppercase letter and one special character.
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select
              name="role"
              className="form-control"
              value={form.role || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select role</option>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2">
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none text-success fw-semibold">
              Login here
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
