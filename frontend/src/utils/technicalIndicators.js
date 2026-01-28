/**
 * Calculates a Rolling RSI Array (Relative Strength Index)
 * Returns an array of objects matching the input data length
 */
export const calculateRSI = (data, period = 14) => {
  const rsiArray = [];
  
  // First, calculate changes
  const changes = data.map((d, i) => {
    if (i === 0) return 0;
    return d.close - data[i - 1].close;
  });

  // Calculate initial averages
  let gain = 0;
  let loss = 0;

  // We can't calculate RSI for the first 'period' days properly
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      rsiArray.push(null); // Not enough data yet
      const change = changes[i];
      if (change > 0) gain += change;
      else loss -= change;
      continue;
    }

    // First calculated RSI
    if (i === period) {
      let avgGain = gain / period;
      let avgLoss = loss / period;
      let rs = avgGain / avgLoss;
      rsiArray.push(100 - 100 / (1 + rs));
    } else {
      // Smoothed RSI for subsequent days
      const change = changes[i];
      let currentGain = change > 0 ? change : 0;
      let currentLoss = change < 0 ? -change : 0;

      // Previous averages need to be stored/recalculated properly for smoothing
      // For simplicity in this demo, we use a simple window, 
      // but in production, use Wilde's Smoothing.
      
      // Re-calculating simple window for robustness in demo:
      let periodGains = 0;
      let periodLosses = 0;
      for(let j=i-period+1; j<=i; j++) {
         const chg = changes[j];
         if(chg > 0) periodGains += chg;
         else periodLosses -= chg;
      }
      
      const avgGain = periodGains / period;
      const avgLoss = periodLosses / period;
      
      if (avgLoss === 0) {
        rsiArray.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsiArray.push(100 - 100 / (1 + rs));
      }
    }
  }
  return rsiArray;
};

/**
 * Calculates MACD, Signal, and Histogram arrays
 */
export const calculateMACD = (data) => {
  // Helper for EMA
  const calcEMA = (values, period) => {
    const k = 2 / (period + 1);
    const emaArray = [values[0]];
    for (let i = 1; i < values.length; i++) {
      emaArray.push(values[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
  };

  const closes = data.map(d => d.close);
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);

  const macdLine = ema12.map((val, i) => val - ema26[i]);
  const signalLine = calcEMA(macdLine, 9);
  
  const histogram = macdLine.map((val, i) => val - signalLine[i]);

  return { macdLine, signalLine, histogram };
};

/**
 * Simple Moving Average (SMA)
 */
export const calculateSMA = (data, period) => {
  const smaArray = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      smaArray.push(null);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    smaArray.push(sum / period);
  }
  return smaArray;
};