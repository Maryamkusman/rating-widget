import React, { useState } from 'react';

const RatingWidget = () => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
    // Send rating to the server
    // ...
  };

  return (
    <div>
      {/* Render stars based on the rating */}
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          onClick={() => handleStarClick(value)}
          style={{ color: value <= rating ? 'gold' : 'gray', cursor: 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingWidget;
