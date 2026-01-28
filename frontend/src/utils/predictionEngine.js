/**
 * Long-term price projection using CAGR-style growth
 * This is NOT guessing — it is scenario-based estimation
 */

export const projectPrice = (currentPrice, growthRate, years) => {
  return +(currentPrice * Math.pow(1 + growthRate, years)).toFixed(2);
};

export const generatePrediction = ({
  currentPrice,
  fundamentalScore,
  technicalTrend,
}) => {
  // Base growth assumptions (conservative)
  let baseGrowth = 0.10; // 10% CAGR

  if (fundamentalScore > 80) baseGrowth += 0.04;
  else if (fundamentalScore > 65) baseGrowth += 0.02;
  else baseGrowth -= 0.02;

  if (technicalTrend === "Bullish") baseGrowth += 0.01;
  if (technicalTrend === "Bearish") baseGrowth -= 0.02;

  const bull = baseGrowth + 0.04;
  const bear = baseGrowth - 0.05;

  return {
    baseGrowth,
    scenarios: {
      bull: {
        "1Y": projectPrice(currentPrice, bull, 1),
        "3Y": projectPrice(currentPrice, bull, 3),
        "5Y": projectPrice(currentPrice, bull, 5),
      },
      base: {
        "1Y": projectPrice(currentPrice, baseGrowth, 1),
        "3Y": projectPrice(currentPrice, baseGrowth, 3),
        "5Y": projectPrice(currentPrice, baseGrowth, 5),
      },
      bear: {
        "1Y": projectPrice(currentPrice, bear, 1),
        "3Y": projectPrice(currentPrice, bear, 3),
        "5Y": projectPrice(currentPrice, bear, 5),
      },
    },
  };
};
