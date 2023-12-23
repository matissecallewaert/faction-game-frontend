import React, { useEffect } from 'react';
import Tile from '../Tile/Tile';
import { useReducer, useState } from 'react';
import {
  getRandomType,
  getRandomCoordinates,
  getRandomNumber,
  size,
  directions,
  baseCount,
  maxMoves,
} from '../../utils';
import { pawnTypes } from '../../pawns';
import logger from '../../logger';

const GameBoard = () => {
  const [isReady, setIsReady] = useState(false);
  const [reset, setReset] = useState(false);

  const initialState = {
    types: [], // resource, base, empty
    factions: [], // belongs to what faction, -1 if no faction
    units: [], // [index, pawnType, faction]
    unitsOnBoard: [], // index of units on the board, when no unit on that tile, it's -1
    gold: [], // gold of each faction
    bombed: [], // index of the faction to what the bom belongs to, -1 if no bomb
    bases: [], // index of the position of the base and boolean if it's destroyed of each faction
    amountOfMoves: Number,
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

  useEffect(() => {
    if (reset === true) {
      dispatch({ type: 'INITIALIZE_BOARD', payload: { state } });
      setReset(false);
    }
  }, [reset]);

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
        const bases = getRandomCoordinates(baseCount);

        state.types = Array.from({ length: size * size }, getRandomType);
        state.unitsOnBoard = Array.from({ length: size * size }, () => -1);
        state.factions = Array.from({ length: size * size }, () => -1);
        state.gold = Array.from({ length: baseCount }, () => 1000);
        state.bombed = Array.from({ length: size * size }, () => -1);

        let units = [];
        let basesOnBoard = [];

        for (let i = 0; i < baseCount; i++) {
          const index = bases[i][1] * size + bases[i][0];

          state.types[index] = 'base';
          basesOnBoard.push([index, false]);

          state.factions[index] = i;
          state.factions[index - 1] = i;
          state.factions[index - 1 + size] = i;

          state.unitsOnBoard[index] = i;
          units.push([index, pawns[getRandomNumber(pawns.length)], i]);
        }

        state.units = units;
        state.bases = basesOnBoard;

        setIsReady(true);

        return { ...state, amountOfMoves: 0 };

      case 'UPDATE_UNITS':

        state.units.map((unit, index) => {
          const x = unit[0] % size;
          const y = Math.floor(unit[0] / size);

          const randomDirection =
            directions[Math.floor(Math.random() * directions.length)];
          const newX = x + randomDirection.dx;
          const newY = y + randomDirection.dy;

          if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
            const newIndex = newY * size + newX;

            unit[0] = newIndex;
            state.unitsOnBoard[newIndex] = index;
            state.unitsOnBoard[y * size + x] = -1;
            state.factions[newIndex] = unit[2];
          }
          return unit;
        });
        const it = state.amountOfMoves + 1;
        if (it >= maxMoves) {
          setReset(true);
        }
        return { ...state, amountOfMoves: it };

      default:
        return state;
    }
  }

  return <div className="game-board">{renderBoard()}</div>;
};

export default GameBoard;