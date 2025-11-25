import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function REITList() {
  const [reits, setReits] = useState([]);

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

  return (
    <div className="container">
      <h2>Available REITs</h2>
      <div className="grid">
        {reits.map((reit) => (
          <Link to={`/reits/${reit.id}`} key={reit.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3>{reit.name}</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '10px' }}>{reit.symbol}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                ₹{Number(reit.price).toFixed(2)}
              </p>
              <div style={{ marginTop: '15px' }}>
                <p><strong>Sector:</strong> {reit.sector}</p>
                <p className="profit"><strong>Annual Return:</strong> {Number(reit.annual_return).toFixed(1)}%</p>
                <p><strong>Dividend Yield:</strong> {Number(reit.dividend_yield).toFixed(1)}%</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default REITList;
