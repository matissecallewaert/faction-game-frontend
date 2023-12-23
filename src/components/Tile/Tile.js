import React from 'react';
import './Tile.css';

const Tile = ({ type, factionColor, unit, bombed }) => {
  const getTileContent = () => {
    if (unit !== undefined) {
      if (unit[1] === 'worker') return <div className="worker"></div>;
      else if (unit[1] === 'warrior') return <div className="warrior"></div>;
      else if (unit[1] === 'miner') return <div>M</div>;
      else if (unit[1] === 'healer') return <div className="healer"></div>;
      else if (unit[1] === 'unit') return <div>U</div>;
    }

    if(bombed){
      return <div className="bomb"></div>;
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
