import React, { useState } from 'react';
import { getToken } from '../utils/auth';

export default function AddUser() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('User added successfully!');
      setForm({ name: '', email: '', password: '', address: '', role: '' });
    } else {
      setMessage(data.message || 'Failed to add user');
    }
  };

  return (
    <>
      <div className="container my-4">
        <h3>Add New User</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Name" name="name" value={form.name} onChange={handleChange} required />
          <input className="form-control mb-2" placeholder="Email" name="email" value={form.email} onChange={handleChange} required />
          <input type="password" className="form-control mb-2" placeholder="Password" name="password" value={form.password} onChange={handleChange} required />
          <input className="form-control mb-2" placeholder="Address" name="address" value={form.address} onChange={handleChange} required />
          <select className="form-control mb-3" name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select role</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button className="btn btn-primary">Add User</button>
        </form>
      </div>
    </>
  );
}
