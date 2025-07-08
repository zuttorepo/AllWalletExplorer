// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let balances = {};

// GET balance
app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.json({ balance });
});

// POST send
app.post('/send', (req, res) => {
  const { from, privateKey, to, amount } = req.body;
  if (!from || !to || !privateKey || isNaN(amount)) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  balances[from] = (balances[from] || 10) - amount;
  balances[to] = (balances[to] || 0) + amount;

  if (balances[from] < 0) {
    return res.status(400).json({ message: "Saldo tidak cukup" });
  }

  res.json({
    status: "success",
    txid: "ZTC_TX_" + Math.floor(Math.random() * 9999999)
  });
});

// Faucet
app.post('/faucet', (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ message: "Alamat kosong" });
  balances[address] = (balances[address] || 0) + 5;
  res.json({ status: "faucet sent", balance: balances[address] });
});

app.listen(PORT, () => {
  console.log(`🚀 ZTC Node API running at http://localhost:${PORT}`);
});
