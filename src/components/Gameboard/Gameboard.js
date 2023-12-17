import React, { useEffect } from 'react';
import Tile from '../Tile/Tile';
import { useState } from 'react';

const GameBoard = () => {
  const [types, setTypes] = useState([]); // resource, base, empty
  const [factions, setFactions] = useState([]); // belongs to what faction
  const [occupations, setOccupations] = useState([]); // is occupied by a unit
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [units, setUnits] = useState([]);
  const [isReady, setIsReady] = useState(false);

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let size = 100;
  let baseCount = 10;

  const handleZoom = (e) => {
    const newScale = e.deltaY > 0 ? scale - 0.1 : scale + 0.1;
    const limitedScale = Math.min(Math.max(newScale, 0.5), 3);
    setScale(limitedScale);
  };

  const handleMouseDown = (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;

    setTranslateX(translateX + deltaX);
    setTranslateY(translateY + deltaY);

    dragStartX = e.clientX;
    dragStartY = e.clientY;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  const handleTouchEnd = () => {
    isDragging = false;
  };

  useEffect(() => {
    const generatedTypes = Array.from({ length: size * size }, getRandomType);
    setOccupations(Array.from({ length: size * size }, () => false));
    setBases(generatedTypes);
    setUnits(Array.from({ length: 1 }, () => [0, 0, "worker", 0]));

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    // Start the interval
    const interval = setInterval(() => {
      handleGameAction();
    }, 5000);

    return () => clearInterval(interval);
  }, [isReady]);

  const handleGameAction = () => {
    console.log('Game action');

    const directions = [
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 }, // Right
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 }, // Down
    ];

    setOccupations((prevOccupations) => {
      const newOccupations = [...prevOccupations];
      setFactions((prevFactions) => {
        const newFactions = [...prevFactions];
        units.forEach((unit) => {
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
            newOccupations[newIndex] = true;
            newOccupations[y * size + x] = false;
            newFactions[newIndex] = unit[3];
          }
        });
        return newFactions;
    });
      return newOccupations;
    });
  };

  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < size * size; i++) {
      board.push(
        <Tile
          key={i}
          type={types[i]}
          factionColor={factions[i]}
          isOccupied={occupations[i]}
        />
      );
    }
    return board;
  };

  const getRandomType = () => {
    const typesEnum = ['resource', ''];
    const randomIndex = Math.floor(Math.random() * typesEnum.length);

    if (typesEnum[randomIndex] === typesEnum[0]) {
      const resourceChance = Math.random();
      if (resourceChance > 0.025) {
        return '';
      }
    }

    return typesEnum[randomIndex];
  };

  const getRandomCoordinates = () => {
    const coordinates = [];
    const numCoordinates = baseCount;

    const isNeighbor = (coord1, coord2) => {
      const [x1, y1] = coord1;
      const [x2, y2] = coord2;
      return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
    };

    const isValidCoordinate = (coord, existingCoordinates) => {
      const [x, y] = coord;
      const isNextToBorder = x === 0 || x === size - 1 || y === 0 || y === size - 1;

      if (isNextToBorder) {
        return false;
      }

      for (const existingCoord of existingCoordinates) {
        if (isNeighbor(coord, existingCoord)) {
          return false;
        }
      }

      return true;
    };

    while (coordinates.length < numCoordinates) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      const newCoord = [x, y];

      if (isValidCoordinate(newCoord, coordinates)) {
        coordinates.push(newCoord);
      }
    }

    return coordinates;
  };

  const setBases = (generatedTypes) => {
    return new Promise((resolve) => {
      const bases = getRandomCoordinates();
      let factions = Array.from({ length: size * size }, () => -1);
      let factionIndex = 0;

      for (const [x, y] of bases) {
        const index = y * size + x;
        generatedTypes[index] = 'base';
        factions[index] = factionIndex;
        factions[index - 1] = factionIndex;
        factions[index - 1 + size] = factionIndex;
        factionIndex++;
      }
      setFactions(factions);
      setTypes(generatedTypes);
      resolve();
    });
  };

  return (
    <div
      className="game-board"
      onWheel={handleZoom}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleTouchEnd}
    >
      {renderBoard()}
    </div>
  );
};

export default GameBoard;
