// src/components/RatingStars.jsx
import React, { useState, useEffect } from 'react';

export default function RatingStars({ initial = 0, onChange, disabled }) {
  const [rating, setRating] = useState(initial);

  useEffect(() => {
    setRating(initial);
  }, [initial]);

  const handleClick = (value) => {
    if (disabled) return;
    setRating(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="rating-stars" style={{ display: 'inline-flex', marginLeft: '8px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: disabled ? 'default' : 'pointer',
            color: star <= rating ? 'var(--color-primary)' : '#ccc',
            fontSize: '1.5rem',
            marginRight: '4px',
          }}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
