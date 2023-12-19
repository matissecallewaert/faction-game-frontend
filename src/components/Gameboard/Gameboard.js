import React, { useEffect } from 'react';
import Tile from '../Tile/Tile';
import { useReducer, useState } from 'react';
import { getRandomType, getRandomCoordinates, getRandomNumber, size, directions } from '../../utils';

const GameBoard = () => {
  const [isReady, setIsReady] = useState(false);

  const initialState = {
    types: [], // resource, base, empty
    factions: [], // belongs to what faction
    occupations: [], // is occupied by a unit
    units: [],
  };
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'INITIALIZE_BOARD', payload: { state } });
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const interval = setInterval(() => {
      handleGameAction();
    }, 5000);

    return () => clearInterval(interval);
  }, [isReady]);

  const handleGameAction = () => {
    console.log('Game action');

    dispatch({ type: 'UPDATE_UNITS', payload: { state } });
  };

  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < size * size; i++) {
      board.push(
        <Tile
          key={i}
          type={state.types[i]}
          factionColor={state.factions[i]}
          isOccupied={state.occupations[i]}
        />
      );
    }
    return board;
  };

  function gameReducer(state, action) {
    switch (action.type) {
      case 'INITIALIZE_BOARD':
        state.occupations = Array.from({ length: size * size }, () => false);
        state.types = Array.from({ length: size * size }, getRandomType);
        state.units = Array.from({ length: 10 }, () => [getRandomNumber(), getRandomNumber(), 'worker', 0]);

        const bases = getRandomCoordinates();
        state.factions = Array.from({ length: size * size }, () => -1);
        let factionIndex = 0;

        for (const [x, y] of bases) {
          const index = y * size + x;
          state.types[index] = 'base';
          state.factions[index] = factionIndex;
          state.factions[index - 1] = factionIndex;
          state.factions[index - 1 + size] = factionIndex;
          factionIndex++;
        }
        setIsReady(true);

        return { ...state, ...action.payload };

      case 'UPDATE_UNITS':

        state.units.map((unit) => {
          console.log(unit);
          const x = unit[0];
          const y = unit[1];

          const randomDirection =
            directions[Math.floor(Math.random() * directions.length)];
          const newX = x + randomDirection.dx;
          const newY = y + randomDirection.dy;

          if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
            unit[0] = newX;
            unit[1] = newY;
            const newIndex = newY * size + newX;
            state.occupations[newIndex] = true;
            state.occupations[y * size + x] = false;
            state.factions[newIndex] = unit[3];
          }
          return unit;
        });
        return { ...state };

      // Add other cases for different actions
      default:
        return state;
    }
  }

  return <div className="game-board">{renderBoard()}</div>;
};

export default GameBoard;
