import React from 'react';
import './Tile.css';
import logger from '../../logger';

const Tile = ({ type, factionColor, unit }) => {
  const getTileContent = () => {
    if (unit !== undefined) {
      logger.info('unit: ', unit);
      if (unit[2] === 'worker') return <div className="worker"></div>;
      else if (unit[2] === 'warrior') return <div className="warrior"></div>;
      else if (unit[2] === 'miner') return <div>M</div>;
      else if (unit[2] === 'healer') return <div className="healer"></div>;
      else if (unit[2] === 'unit') return <div>U</div>;
    }
    return null;
  };

  return (
    <div
      className={`tile ${type} ${
        unit ? 'occupied' : ''
      } faction_${factionColor}`}
    >
      {getTileContent()}
    </div>
  );
};

export default Tile;
