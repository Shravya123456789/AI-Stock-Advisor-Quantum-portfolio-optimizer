// A helper to generate realistic-looking stock market data
// Simulates 6 months of price action with trends and volatility
const generateData = () => {
  const data = [];
  let price = 2450.0; // Starting price (e.g., RELIANCE)
  const today = new Date();
  
  // Generate 180 days of data (approx 6 months)
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random walk volatility
    const change = (Math.random() - 0.48) * 45; 
    price = price + change;

    // Ensure price doesn't go negative
    if (price < 100) price = 100;

    data.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      open: parseFloat((price + Math.random() * 10).toFixed(2)),
      high: parseFloat((price + Math.random() * 25).toFixed(2)),
      low: parseFloat((price - Math.random() * 25).toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }
  return data;
};

export const priceData = generateData();