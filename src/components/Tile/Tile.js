import React from 'react';
import './Tile.css';

const Tile = ({ type, factionColor, isOccupied }) => {
  const getTileContent = () => {
    if (isOccupied) return <div className="unit">Unit</div>;
    return null;
  };

  return (
    <div className={`tile ${type} ${isOccupied ? 'occupied' : ''} faction_${factionColor}`}>
      {getTileContent()}
    </div>
  );
};

export default Tile;
