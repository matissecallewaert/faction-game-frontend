import React, { useEffect } from 'react';
import Tile from '../Tile/Tile';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';

const GameBoard = () => {
  const [types, setTypes] = useState([]);
  const [contents, setContents] = useState([]);
  const [colors, setColors] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
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

  useEffectOnce(() => {
    console.log('Gameboard mounted');
    GameBoard();
    setInterval(() => {
      handleGameAction();
    }, 5000);
  });

  const handleGameAction = () => {
    console.log('Game action');

    const directions = [
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 }, // Right
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 }, // Down
    ];

    const trueIndexes = occupations.reduce((indexes, occupation, index) => {
      if (occupation) {
        indexes.push(index);
      }
      return indexes;
    }, []);

    console.log(trueIndexes);

    setOccupations((prevOccupations) => {
      const newOccupations = [...prevOccupations];

      trueIndexes.forEach((index) => {
        const x = index % size;
        const y = Math.floor(index / size);

        const randomDirection =
          directions[Math.floor(Math.random() * directions.length)];
        const newX = x + randomDirection.dx;
        const newY = y + randomDirection.dy;

        if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
          const newIndex = newY * size + newX;
          newOccupations[newIndex] = true;
          newOccupations[index] = false;
        }
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
          content={contents[i]}
          factionColor={colors[i]}
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

  const getRandomOccupation = () => {
    const randomIndex = Math.floor(Math.random() * 2);
    if (Math.random() < 0.999) {
      return false;
    }
    return randomIndex === 0;
  };

  const getRandomColor = () => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const getRandomContent = () => {
    return '';
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
    const bases = getRandomCoordinates();

    for (const [x, y] of bases) {
      const index = y * size + x;
      generatedTypes[index] = 'base';
    }

    setTypes(generatedTypes);
  };

  const GameBoard = () => {
    const generatedTypes = Array.from({ length: size * size }, getRandomType);
    setContents(Array.from({ length: size * size }, getRandomContent));
    setColors(Array.from({ length: size * size }, getRandomColor));
    setOccupations(Array.from({ length: size * size }, getRandomOccupation));
    setBases(generatedTypes);
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
