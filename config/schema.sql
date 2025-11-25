CREATE DATABASE IF NOT EXISTS reit_platform;
USE reit_platform;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 100000.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  annual_return DECIMAL(5, 2),
  dividend_yield DECIMAL(5, 2),
  sector VARCHAR(50),
  description TEXT,
  market_cap DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reit_id INT NOT NULL,
  shares DECIMAL(10, 4) NOT NULL,
  avg_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reit_id) REFERENCES reits(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reit_id INT NOT NULL,
  type ENUM('BUY', 'SELL') NOT NULL,
  shares DECIMAL(10, 4) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reit_id) REFERENCES reits(id) ON DELETE CASCADE
);

CREATE TABLE community_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample REITs
INSERT INTO reits (name, symbol, price, annual_return, dividend_yield, sector, description, market_cap) VALUES
('American Tower Corp', 'AMT', 215.50, 8.5, 3.2, 'Infrastructure', 'Leading wireless infrastructure REIT', 98500000000),
('Prologis Inc', 'PLD', 128.75, 12.3, 2.8, 'Industrial', 'Global leader in logistics real estate', 95200000000),
('Crown Castle Inc', 'CCI', 105.20, 7.8, 4.5, 'Infrastructure', 'Shared communications infrastructure', 45600000000),
('Realty Income Corp', 'O', 58.90, 5.2, 5.1, 'Retail', 'Monthly dividend REIT', 42300000000),
('Equinix Inc', 'EQIX', 825.40, 15.6, 1.9, 'Data Centers', 'Digital infrastructure company', 76800000000),
('Public Storage', 'PSA', 295.30, 6.7, 3.8, 'Self Storage', 'Self-storage facilities operator', 51700000000);
