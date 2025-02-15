import { useWindowDimensions } from 'react-native';

// ✅ Set ground dimensions dynamically for 16x9 grid
const useGroundDimensions = (tileSize = 100, totalColumns = 16, totalRows = 9) => {
  // 🔹 Ground should match a 16:9 aspect ratio
  const groundWidth = totalColumns * tileSize; 
  const groundHeight = totalRows * tileSize;

  return {
    groundWidth,
    groundHeight,
    totalColumns,
    totalRows,
    tileWidth: tileSize,
    tileHeight: tileSize,
  };
};

export default useGroundDimensions;
