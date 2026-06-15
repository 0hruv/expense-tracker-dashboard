import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      amount REAL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

app.get('/api/expenses', async (req, res) => {
  const expenses = await db.all('SELECT * FROM expenses ORDER BY date DESC');
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const { description, amount } = req.body;
  const result = await db.run(
    'INSERT INTO expenses (description, amount) VALUES (?, ?)',
    [description, amount]
  );
  res.json({ id: result.lastID, description, amount });
});

app.listen(3002, () => console.log('Expense Tracker API on http://localhost:3002'));
