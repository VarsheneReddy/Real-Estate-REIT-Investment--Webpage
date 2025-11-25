import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Portfolio({ user }) {
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/portfolio/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/portfolio/transactions/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const totalInvested = portfolio.reduce((sum, item) => sum + Number(item.invested_amount), 0);
  const totalValue = portfolio.reduce((sum, item) => sum + Number(item.current_value), 0);
  const totalProfitLoss = totalValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div className="container">
      <h2>My Portfolio</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h4>Total Invested</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{totalInvested.toFixed(2)}</p>
        </div>
        <div className="card">
          <h4>Current Value</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{totalValue.toFixed(2)}</p>
        </div>
        <div className="card">
          <h4>Profit/Loss</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className={totalProfitLoss >= 0 ? 'profit' : 'loss'}>
            ₹{totalProfitLoss.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h4>Return %</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className={totalProfitLoss >= 0 ? 'profit' : 'loss'}>
            {totalProfitLossPercent}%
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Holdings</h3>
        {portfolio.length === 0 ? (
          <p>No investments yet. Start investing in REITs!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>REIT</th>
                <th>Shares</th>
                <th>Avg Price</th>
                <th>Current Price</th>
                <th>Invested</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
                <th>Return %</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.symbol}</strong><br/>{item.name}</td>
                  <td>{Number(item.shares).toFixed(2)}</td>
                  <td>₹{Number(item.avg_price).toFixed(2)}</td>
                  <td>₹{Number(item.current_price).toFixed(2)}</td>
                  <td>₹{Number(item.invested_amount).toFixed(2)}</td>
                  <td>₹{Number(item.current_value).toFixed(2)}</td>
                  <td className={Number(item.profit_loss) >= 0 ? 'profit' : 'loss'}>
                    ₹{Number(item.profit_loss).toFixed(2)}
                  </td>
                  <td className={Number(item.profit_loss) >= 0 ? 'profit' : 'loss'}>
                    {Number(item.profit_loss_percent).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>REIT</th>
                <th>Type</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td>{tx.symbol}</td>
                  <td><span style={{ color: tx.type === 'BUY' ? '#27ae60' : '#e74c3c' }}>{tx.type}</span></td>
                  <td>{Number(tx.shares).toFixed(2)}</td>
                  <td>₹{Number(tx.price).toFixed(2)}</td>
                  <td>₹{Number(tx.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
