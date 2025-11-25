import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function REITDetails({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reit, setReit] = useState(null);
  const [shares, setShares] = useState('');
  const [message, setMessage] = useState('');

  const mockPriceHistory = [
    { month: 'Jan', price: 200 },
    { month: 'Feb', price: 205 },
    { month: 'Mar', price: 210 },
    { month: 'Apr', price: 208 },
    { month: 'May', price: 215 },
    { month: 'Jun', price: 220 }
  ];

  useEffect(() => {
    fetchREIT();
  }, [id]);

  const fetchREIT = async () => {
    try {
      const response = await axios.get(`/api/reits/${id}`);
      setReit(response.data);
    } catch (error) {
      console.error('Error fetching REIT:', error);
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    
    const totalCost = parseFloat(shares) * Number(reit.price);
    
    if (totalCost > Number(user.balance)) {
      setMessage('Insufficient balance!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/portfolio/invest',
        {
          userId: user.id,
          reitId: reit.id,
          shares: parseFloat(shares),
          price: Number(reit.price)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updatedUser = { ...user, balance: response.data.balance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Investment successful!');
      setShares('');
      setTimeout(() => navigate('/portfolio'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Investment failed');
    }
  };

  if (!reit) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/reits')} className="btn btn-primary" style={{ marginBottom: '20px' }}>
        ← Back to REITs
      </button>
      
      <div className="card">
        <h2>{reit.name} ({reit.symbol})</h2>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', margin: '20px 0' }}>
          ₹{Number(reit.price).toFixed(2)}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <p><strong>Sector:</strong> {reit.sector}</p>
            <p><strong>Annual Return:</strong> <span className="profit">{Number(reit.annual_return).toFixed(1)}%</span></p>
          </div>
          <div>
            <p><strong>Dividend Yield:</strong> {Number(reit.dividend_yield).toFixed(1)}%</p>
            <p><strong>Market Cap:</strong> ₹{(Number(reit.market_cap) / 10000000).toFixed(2)}Cr</p>
          </div>
        </div>
        
        <p style={{ marginBottom: '20px' }}>{reit.description}</p>

        <h3>Price History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockPriceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#3498db" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Invest in {reit.symbol}</h3>
          {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
          <form onSubmit={handleInvest}>
            <input
              type="number"
              step="0.01"
              placeholder="Number of shares"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              required
            />
            <p style={{ margin: '10px 0' }}>
              Total Cost: ₹{(shares * Number(reit.price) || 0).toFixed(2)}
            </p>
            <button type="submit" className="btn btn-success">
              Invest Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default REITDetails;
