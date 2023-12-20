import React, { useEffect } from 'react';
import Tile from '../Tile/Tile';
import { useReducer, useState } from 'react';
import {
  getRandomType,
  getRandomCoordinates,
  getRandomNumber,
  size,
  directions,
} from '../../utils';
import { pawnTypes } from '../../pawns';
import logger from '../../logger';

const GameBoard = () => {
  const [isReady, setIsReady] = useState(false);

  const initialState = {
    types: [], // resource, base, empty
    factions: [], // belongs to what faction
    units: [],
    unitsOnBoard: [], // index of units on the board, when no unit on that tile, it's -1
    gold: [], // gold of each faction
    bombed: [], // index of the faction to what the bom belongs to, -1 if no bomb
    bases: [], // index of the position of the base and boolean if it's destroyed of each faction
  };
  const pawns = Object.values(pawnTypes);
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
    logger.info('Game action');

    dispatch({ type: 'UPDATE_UNITS', payload: { state } });
  };

  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < size * size; i++) {
      if(state.unitsOnBoard[i] === -1) {
        board.push(
          <Tile
            key={i}
            type={state.types[i]}
            factionColor={state.factions[i]}
            unit={undefined}
          />
        );
      }else {
        board.push(
          <Tile
            key={i}
            type={state.types[i]}
            factionColor={state.factions[i]}
            unit={state.units[state.unitsOnBoard[i]]}
          />
        );
      }
    }
    return board;
  };

  function gameReducer(state, action) {
    switch (action.type) {
      case 'INITIALIZE_BOARD':
        const bases = getRandomCoordinates();

        state.types = Array.from({ length: size * size }, getRandomType);
        state.unitsOnBoard = Array.from({ length: size * size }, () => -1);
        state.factions = Array.from({ length: size * size }, () => -1);

        let units = [];
        for (let i = 0; i < 10; i++) {
          const x = getRandomNumber(size);
          const y = getRandomNumber(size);
          const index = y * size + x;

          state.unitsOnBoard[index] = i;
          state.factions[index] = i;
          units.push([x, y, pawns[getRandomNumber(pawns.length)], i]);
        }
        state.units = units;
        
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
        state.units.map((unit, index) => {
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
            state.unitsOnBoard[newIndex] = index;
            state.unitsOnBoard[y * size + x] = -1;
            state.factions[newIndex] = unit[3];
          }
          return unit;
        });
        return { ...state };

      default:
        return state;
    }
  }

  return <div className="game-board">{renderBoard()}</div>;
};

export default GameBoard;
