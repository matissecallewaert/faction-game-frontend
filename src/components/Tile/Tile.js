import React from 'react';
import './Tile.css';
import { UNITTYPE } from '../../constants/UnitTypes';

const Tile = ({ type, factionColor, unit, bombed }) => {
  const getTileContent = () => {
    if (unit !== undefined) {
      if (unit.type === UNITTYPE.WORKER) return <div className="worker"></div>;
      else if (unit.type === UNITTYPE.WARRIOR) return <div className="warrior"></div>;
      else if (unit.type === UNITTYPE.MINER) return <div>M</div>;
      else if (unit.type === UNITTYPE.HEALER) return <div className="healer"></div>;
      else if (unit.type === UNITTYPE.UNIT) return <div>U</div>;
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
