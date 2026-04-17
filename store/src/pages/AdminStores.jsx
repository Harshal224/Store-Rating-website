import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    setMsg('');
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.address) params.append('address', filters.address);

      const res = await fetch(`http://localhost:5000/api/admin/stores?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch stores');
      setStores(data);
    } catch (err) {
      setMsg(err.message || 'Error fetching stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchStores();
  };

  return (
    <>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Stores</h3>
          <Link to="/admin/addstore" className="btn btn-sm btn-primary">Add Store</Link>
        </div>

        <form className="row g-2 mb-3" onSubmit={applyFilters}>
          <div className="col-md-4">
            <input name="name" value={filters.name} onChange={handleFilterChange} className="form-control" placeholder="Filter by name" />
          </div>
          <div className="col-md-4">
            <input name="address" value={filters.address} onChange={handleFilterChange} className="form-control" placeholder="Filter by address" />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary me-2" type="submit">Apply</button>
            <button className="btn btn-secondary" type="button" onClick={() => { setFilters({ name: '', address: '' }); setStores([]); fetchStores(); }}>Reset</button>
          </div>
        </form>

        {msg && <div className="alert alert-danger">{msg}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Owner Email</th>
                  <th>Average Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted">No stores found</td></tr>
                ) : (
                  stores.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.address}</td>
                      <td>{s.ownerEmail}</td>
                      <td>{s.averageRating !== null ? Number(s.averageRating).toFixed(2) : 'Not rated'}</td>
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
