/**
 * Fisher-Yates 洗牌算法
 * @param {Array} array - 要洗牌的数组
 * @returns {Array} - 洗牌后的新数组
 */
export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
