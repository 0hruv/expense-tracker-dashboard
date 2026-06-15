import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState([])
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetch('http://localhost:3002/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data))
  }, [])

  const addExpense = (e) => {
    e.preventDefault()
    fetch('http://localhost:3002/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: desc, amount: parseFloat(amount) })
    }).then(res => res.json())
      .then(newExp => {
        setExpenses([newExp, ...expenses])
        setDesc('')
        setAmount('')
      })
  }

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <div className="dashboard">
        <h2>Total Spent: ${total.toFixed(2)}</h2>
      </div>
      <form onSubmit={addExpense}>
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" required />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required />
        <button type="submit">Add Expense</button>
      </form>
      <div className="list">
        {expenses.map(exp => (
          <div key={exp.id} className="item">
            <span>{exp.description}</span>
            <span>${exp.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
