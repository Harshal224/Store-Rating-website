import React, { useEffect, useState } from 'react';
import { getToken, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import StoreCard from '../components/StoreCard';

const StorePage = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchStores = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/user/stores?search=${search}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStores(data);
    } else {
      throw new Error("Server did not return JSON");
    }

  } catch (err) {
    console.error("Fetch error:", err.message);
  }
};

  const handleRate = async (storeId, rating) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/rate/${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ rating: parseInt(rating) })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchStores(); // Refresh store list
    } catch (err) {
      console.error('Rating error:', err.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Stores</h2>
      <button onClick={handleLogout}>Logout</button>

      <input
        type="text"
        placeholder="Search by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            userRating={store.userRating}
            onRate={handleRate}
          />
        ))
      )}
    </div>
  );
};

export default StorePage;
