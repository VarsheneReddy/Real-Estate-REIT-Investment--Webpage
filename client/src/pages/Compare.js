import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Compare() {
  const [reits, setReits] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchREITs();
  }, []);

  const fetchREITs = async () => {
    try {
      const response = await axios.get('/api/reits');
      setReits(response.data);
    } catch (error) {
      console.error('Error fetching REITs:', error);
    }
  };

  const handleSelect = (reitId) => {
    if (selected.includes(reitId)) {
      setSelected(selected.filter(id => id !== reitId));
    } else if (selected.length < 3) {
      setSelected([...selected, reitId]);
    }
  };

  const selectedREITs = reits.filter(r => selected.includes(r.id));
  
  const comparisonData = selectedREITs.map(r => ({
    name: r.symbol,
    price: Number(r.price),
    annualReturn: Number(r.annual_return),
    dividendYield: Number(r.dividend_yield)
  }));

  return (
    <div className="container">
      <h2>Compare REITs</h2>
      <p>Select up to 3 REITs to compare</p>
      
      <div className="grid" style={{ marginTop: '20px' }}>
        {reits.map((reit) => (
          <div 
            key={reit.id} 
            className="card" 
            style={{ 
              cursor: 'pointer',
              border: selected.includes(reit.id) ? '3px solid #3498db' : '1px solid #ddd'
            }}
            onClick={() => handleSelect(reit.id)}
          >
            <h3>{reit.name}</h3>
            <p>{reit.symbol}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{Number(reit.price).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {selectedREITs.length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Comparison Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="price" fill="#3498db" />
              <Bar dataKey="annualReturn" fill="#27ae60" />
              <Bar dataKey="dividendYield" fill="#e74c3c" />
            </BarChart>
          </ResponsiveContainer>

          <table style={{ marginTop: '30px' }}>
            <thead>
              <tr>
                <th>REIT</th>
                <th>Price</th>
                <th>Annual Return</th>
                <th>Dividend Yield</th>
                <th>Sector</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {selectedREITs.map((reit) => (
                <tr key={reit.id}>
                  <td><strong>{reit.symbol}</strong><br/>{reit.name}</td>
                  <td>₹{Number(reit.price).toFixed(2)}</td>
                  <td className="profit">{Number(reit.annual_return).toFixed(1)}%</td>
                  <td>{Number(reit.dividend_yield).toFixed(1)}%</td>
                  <td>{reit.sector}</td>
                  <td>₹{(Number(reit.market_cap) / 10000000).toFixed(2)}Cr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Compare;
