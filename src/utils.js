export const size = 100;
export const baseCount = 10;
export const directions = [
  { dx: -1, dy: 0 }, // Left
  { dx: 1, dy: 0 }, // Right
  { dx: 0, dy: -1 }, // Up
  { dx: 0, dy: 1 }, // Down
];

export const getRandomType = () => {
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

export const getRandomCoordinates = () => {
  const coordinates = [];
  const numCoordinates = baseCount;

  const isNeighbor = (coord1, coord2) => {
    const [x1, y1] = coord1;
    const [x2, y2] = coord2;
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
  };

  const isValidCoordinate = (coord, existingCoordinates) => {
    const [x, y] = coord;
    const isNextToBorder =
      x === 0 || x === size - 1 || y === 0 || y === size - 1;

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

export const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};
