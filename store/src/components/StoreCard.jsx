import React from 'react';
import { FaStar } from 'react-icons/fa';

const StoreCard = ({ store, onRate }) => {
  const renderStars = (currentValue, onClickHandler = null) => {
    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={20}
            style={{ cursor: onClickHandler ? 'pointer' : 'default', marginRight: 4 }}
            color={star <= currentValue ? '#f5c518' : '#e4e5e9'}
            onClick={onClickHandler ? () => onClickHandler(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="card shadow mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      {/* Card Header */}
      <div
        style={{
          background: 'linear-gradient(90deg, #007bff, #00c6ff)',
          color: 'white',
          padding: '12px 16px'
        }}
      >
        <h5 className="mb-0 fw-bold">{store.name}</h5>
        <small className="text-light">{store.address}</small>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Ratings Section */}
        <div className="row mb-3">
          <div className="col-md-6">
            <strong className="d-block mb-1">Average Rating</strong>
            {store.averageRating ? (
              <div className="d-flex align-items-center">
                {renderStars(Math.round(store.averageRating))}
                <span className="ms-2 text-muted">
                  {store.averageRating.toFixed(1)}
                </span>
              </div>
            ) : (
              <p className="text-muted mb-0">No ratings yet</p>
            )}
          </div>
          <div className="col-md-6">
            <strong className="d-block mb-1">Your Rating</strong>
            <div className="d-flex align-items-center">
              {renderStars(store.userRating || 0, (value) => onRate(store.id, value))}
              <span className="ms-2 text-muted">
                {store.userRating ? `${store.userRating}/5` : 'Not rated yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Ratings */}
        {store.ratings.length > 0 && (
          <>
            <hr />
            <strong className="d-block mb-2">Recent Ratings</strong>
            <ul className="list-unstyled mb-0">
              {store.ratings.slice(0, 3).map((r, idx) => (
                <li key={idx} className="text-muted small">
                  {r.user.name}: {r.value}/5
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
