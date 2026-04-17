import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { useParams } from 'react-router-dom';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
        setUser(data);
      } catch (err) {
        setMsg(err.message || 'Error loading user');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (msg) return <div className="container my-4"><div className="alert alert-danger">{msg}</div></div>;
  if (!user) return <div className="container my-4"><div className="alert alert-info">No user found</div></div>;

  return (
    <>
      <div className="container my-4">
        <h3>User Details</h3>
        <div className="card mb-3">
          <div className="card-body">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        </div>

        {user.role === 'OWNER' && (
          <>
            <h5>Ratings (owner's stores)</h5>
            {user.ratings && user.ratings.length > 0 ? (
              <table className="table">
                <thead><tr><th>Store</th><th>Rating</th></tr></thead>
                <tbody>
                  {user.ratings.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.storeName}</td>
                      <td>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No ratings available for this owner.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
