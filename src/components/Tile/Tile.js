import React from 'react';
import './Tile.css';

const Tile = ({ type, content, factionColor, isOccupied }) => {
  const getTileContent = () => {
    if (isOccupied) return <div className="unit">Unit</div>;
    return null;
  };

  return (
    <div className={`tile ${type} ${isOccupied ? 'occupied' : ''}`}>
      {getTileContent()}
    </div>
  );
};

export default Tile;
