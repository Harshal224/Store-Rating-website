import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: '' }); // Added role here
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Login failed');
      return;
    }

    // Save token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Role-based redirect
    if (data.user.role === 'OWNER') {
      navigate('/owner/dashboard');
    } else if (data.user.role === 'USER') {
      navigate('/dashboard');
    }else if (data.user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      // fallback route if role is unknown
      navigate('/dashboard');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong');
  }
};


  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <i className="bi bi-box-arrow-in-right text-primary fs-1"></i>
          <h3 className="mt-2 text-primary fw-bold">Welcome Back</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Please login to continue
          </p>
        </div>

        {/* Error message */}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
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
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select role</option>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{' '}
            <Link to="/register" className="text-decoration-none text-primary fw-semibold">
              Register here
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
