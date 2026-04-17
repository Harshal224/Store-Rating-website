import React, { useEffect, useState } from 'react';
import { getToken, getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import StoreCard from '../components/StoreCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStores = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/stores?search=${search}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStores(data);
    } catch (err) {
      console.error('Store fetch failed:', err.message);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      const store = stores.find(s => s.id === storeId);
      const alreadyRated = store && store.userRating !== null;

      const res = await fetch(`http://localhost:5000/api/user/rate/${storeId}`, {
        method: alreadyRated ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(alreadyRated ? { value: rating } : { rating })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Instant UI update
      setStores(prev =>
        prev.map(s =>
          s.id === storeId
            ? {
                ...s,
                userRating: rating,
                ratings: alreadyRated
                  ? s.ratings.map(r =>
                      r.user.id === getUser().id ? { ...r, value: rating } : r
                    )
                  : [
                      ...s.ratings,
                      { value: rating, user: { id: getUser().id, name: getUser().name } }
                    ]
              }
            : s
        )
      );

      // Ensure backend sync
      fetchStores();
    } catch (err) {
      console.error('Rating failed:', err.message);
    }
  };

  useEffect(() => {
    if (!getToken()) return navigate('/login');
    fetchStores();
  }, [search]);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-primary" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <i className="bi bi-shop-window me-2"></i> Store Dashboard
        </h2>
      </div>

      {/* Search bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <input
            className="form-control"
            placeholder="🔍 Search stores..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              borderRadius: '30px',
              padding: '10px 15px',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Store list */}
      <div className="row g-4">
        {stores.length === 0 ? (
          <div className="col-12 text-center text-muted">
            <i className="bi bi-emoji-frown fs-1"></i>
            <p className="mt-2">No stores found</p>
          </div>
        ) : (
          stores.map(store => (
            <div key={store.id} className="col-md-6 col-lg-4">
              <div style={{ animation: 'fadeIn 0.4s ease-in-out' }}>
                <StoreCard store={store} onRate={handleRating} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
