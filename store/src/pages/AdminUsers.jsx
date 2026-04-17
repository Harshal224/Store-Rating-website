import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setMsg('');
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);
      if (filters.role) params.append('role', filters.role);

      const res = await fetch(`http://localhost:5000/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data);
    } catch (err) {
      setMsg(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Users</h3>
          <Link to="/admin/adduser" className="btn btn-sm btn-primary">Add User</Link>
        </div>

        <form className="row g-2 mb-3" onSubmit={applyFilters}>
          <div className="col-md-3">
            <input name="name" value={filters.name} onChange={handleFilterChange} className="form-control" placeholder="Name" />
          </div>
          <div className="col-md-3">
            <input name="email" value={filters.email} onChange={handleFilterChange} className="form-control" placeholder="Email" />
          </div>
          <div className="col-md-3">
            <input name="address" value={filters.address} onChange={handleFilterChange} className="form-control" placeholder="Address" />
          </div>
          <div className="col-md-2">
            <select name="role" value={filters.role} onChange={handleFilterChange} className="form-control">
              <option value="">Any role</option>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="col-md-1">
            <button className="btn btn-primary w-100" type="submit">Apply</button>
          </div>
        </form>

        {msg && <div className="alert alert-danger">{msg}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted">No users found</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.address}</td>
                      <td>{u.role}</td>
                      <td>
                        <Link to={`/admin/users/${u.id}`} className="btn btn-sm btn-outline-primary me-2">View</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
