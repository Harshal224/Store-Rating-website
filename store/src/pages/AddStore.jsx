import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';

export default function AddStore() {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', ownerId: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/users?role=OWNER', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(setOwners);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/admin/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Store added successfully!');
      setForm({ name: '', address: '', ownerId: '' });
    } else {
      setMessage(data.message || 'Failed to add store');
    }
  };

  return (
    <>
      <div className="container my-4">
        <h3>Add New Store</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Store Name" name="name" value={form.name} onChange={handleChange} required />
          <input className="form-control mb-2" placeholder="Address" name="address" value={form.address} onChange={handleChange} required />
          <select className="form-control mb-3" name="ownerId" value={form.ownerId} onChange={handleChange} required>
            <option value="">Select Owner</option>
            {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
          </select>
          <button className="btn btn-primary">Add Store</button>
        </form>
      </div>
    </>
  );
}
