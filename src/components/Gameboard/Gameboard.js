import React, { useEffect, useState } from 'react';
import Tile from '../Tile/Tile';
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
      console.log('Rendering Gameboard...');
      const currentGameRes = await GameApi.getCurrentGame();
  
      const gameId = currentGameRes.gameId;
      const [factionsRes, tilesRes] = await Promise.all([
        FactionApi.getFactions(gameId),
        TileApi.getTiles(gameId)
      ]);
  
      const unitsRes = await Promise.all(factionsRes.map(faction =>
        UnitApi.getUnits(gameId, faction.id)
      ));
  
      setGame(currentGameRes);
      setFactions(factionsRes);
      setTiles(tilesRes);
      setUnits(unitsRes.flat());
  
      // Render the game board
      if (currentGameRes) {
        renderBoard();
      }
    };
  
    // Fetch game data initially and then set up interval
    fetchGame();
    const interval = setInterval(fetchGame, 5000);
  
    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  const renderBoard = () => {
    return tiles.map((tile) => (
      <Tile
        key={tile.id}
        type={tile.resourceType}
        factionColor={tile.factionId}
        unit={units.flat().find(u => u.id === tile.unit)}
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
