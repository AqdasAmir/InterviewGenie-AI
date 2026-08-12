import React from 'react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loading-overlay">
      <div className="ai-pulse">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;