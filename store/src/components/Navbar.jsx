// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkHover = (e, color) => (e.target.style.color = color);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4 shadow"
      style={{
        background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
        borderBottom: '2px solid rgba(255,255,255,0.2)'
      }}
    >
      {/* Brand */}
      <Link
        className="navbar-brand fw-bold text-white"
        to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
        style={{ fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      >
        <i className="bi bi-shop me-2"></i> StoreRating
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Menu */}
      <div className="collapse navbar-collapse" id="navMenu">
        {/* Left Links */}
        <ul className="navbar-nav me-auto">
          {role === 'USER' && (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/dashboard"
                  style={{ transition: '0.3s', color: 'white' }}
                  onMouseEnter={(e) => linkHover(e, '#ffd700')}
                  onMouseLeave={(e) => linkHover(e, 'white')}
                >
                  Stores
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/updatepassword"
                  style={{ transition: '0.3s', color: 'white' }}
                  onMouseEnter={(e) => linkHover(e, '#ffd700')}
                  onMouseLeave={(e) => linkHover(e, 'white')}
                >
                  Update Password
                </Link>
              </li>
            </>
          )}

          {role === 'OWNER' && (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/owner/dashboard"
                  style={{ transition: '0.3s', color: 'white' }}
                  onMouseEnter={(e) => linkHover(e, '#ffd700')}
                  onMouseLeave={(e) => linkHover(e, 'white')}
                >
                  My Store Ratings
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/updatepassword"
                  style={{ transition: '0.3s', color: 'white' }}
                  onMouseEnter={(e) => linkHover(e, '#ffd700')}
                  onMouseLeave={(e) => linkHover(e, 'white')}
                >
                  Update Password
                </Link>
              </li>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/admin/dashboard"
                  style={{ transition: '0.3s', color: 'white' }}
                  onMouseEnter={(e) => linkHover(e, '#ffd700')}
                  onMouseLeave={(e) => linkHover(e, 'white')}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/admin/stores"
                  style={{ transition: '0.3s', color: 'white' }}
                  onMouseEnter={(e) => linkHover(e, '#ffd700')}
                  onMouseLeave={(e) => linkHover(e, 'white')}
                >
                  Manage Stores
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/admin/users"
                  style={{ transition: '0.3s', color: 'white' }}
                  onMouseEnter={(e) => linkHover(e, '#ffd700')}
                  onMouseLeave={(e) => linkHover(e, 'white')}
                >
                  Manage Users
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Right Section */}
        <ul className="navbar-nav ms-auto align-items-center">
          {user && (
            <>
              <li className="nav-item me-3">
                <span
                  className="badge bg-light text-dark p-2"
                  style={{ fontSize: '0.9rem', borderRadius: '50px' }}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name}{" "}
                  <span className="text-muted">({role})</span>
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm fw-semibold"
                  style={{ borderRadius: '20px', padding: '5px 15px' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
