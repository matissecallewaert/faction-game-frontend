import React, { useEffect, useState } from 'react';
import Tile from '../Tile/Tile';
import axios from 'axios';
import GameApi from '../../api/GameApi';
import FactionApi from '../../api/FactionApi';
import TileApi from '../../api/TileApi';
import UnitApi from '../../api/UnitApi';

const GameBoard = () => {
  const [game, setGame] = useState(null);
  const [factions, setFactions] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      const currentGameRes = await GameApi.getCurrentGame();
      setGame(currentGameRes);

      const gameId = currentGameRes.gameId;
      const [factionsRes, tilesRes] = await Promise.all([
        FactionApi.getFactions(gameId),
        TileApi.getTiles(gameId)
      ]);
      
      setFactions(factionsRes);
      setTiles(tilesRes);

      const unitsRes = await Promise.all(factionsRes.map(faction => 
        UnitApi.getUnits(gameId, faction.id)
      ));

      setUnits(unitsRes.flat());
    };

    fetchGame();
  }, []);

  const renderBoard = () => {
    return tiles.map((tile) => (
      <Tile
        key={tile.id}
        type={tile.type}
        factionColor={tile.factionId}
        unit={units.find(u => u.id === tile.unit)}
        bombed={tile.bombed}
      />
    ));
  };

  if (game) {
    return <div className="game-board">{renderBoard()}</div>;
  }else{
    return <div>Loading...</div>;
  }

  
};

export default GameBoard;
