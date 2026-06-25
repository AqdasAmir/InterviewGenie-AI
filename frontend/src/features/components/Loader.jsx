import React from 'react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;