import React, { useEffect, useState } from 'react';
import FactionApi from '../../api/FactionApi';
import GameApi from '../../api/GameApi';
import './Scoreboard.css';

const ScoreBoard = () => {
  const [factions, setFactions] = useState([]);

  useEffect(() => {
    const fetchScoreboard = async () => {
        const currentGameRes = await GameApi.getCurrentGame();
        const gameId = currentGameRes.gameId;

        const factionsRes = await FactionApi.getFactions(gameId);
        setFactions(factionsRes);

        // Render the score board
      if (factions) {
        renderScoreBoard();
      }
    };
  
    // Fetch game data initially and then set up interval
    fetchScoreboard();
    const interval = setInterval(fetchScoreboard, 5000);
  
    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  const renderScoreBoard = () => {
    return <div className="score-board">
        <table>
            <tr>
                <th>Faction</th>
                <th>Score</th>
                <th>Gold</th>
                <th>Kills</th>
                <th>Population</th>
                <th>Land</th>
            </tr>
        {factions.map((faction) => (
            <tr>
                <td>{faction.id}</td>
                <td>{faction.score}</td>
                <td>{faction.gold}</td>
                <td>{faction.kills}</td>
                <td>{faction.population}</td>
                <td>{faction.land}</td>
            </tr>
        ))}
        </table>
      </div>
  };

  if (factions) {
    return <div className="score-board">{renderScoreBoard()}</div>;
  }else{
    return <div>Loading...</div>;
  }

  
};

export default ScoreBoard;
