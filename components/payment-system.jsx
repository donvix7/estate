'use client'

import { useState, useEffect } from 'react'

export function PaymentSystem() {
  const [paymentAmount, setPaymentAmount] = useState(5000)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-01-15', amount: 5000, status: 'Paid', type: 'Maintenance' },
    { id: 2, date: '2023-12-15', amount: 5000, status: 'Paid', type: 'Maintenance' },
    { id: 3, date: '2023-11-15', amount: 5000, status: 'Overdue', type: 'Maintenance' }
  ])
  const [showReceipt, setShowReceipt] = useState(false)

  const handlePayment = () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      const newTransaction = {
        id: transactions.length + 1,
        date: new Date().toISOString().split('T')[0],
        amount: paymentAmount,
        status: 'Paid',
        type: 'Maintenance'
      }
      
      setTransactions([newTransaction, ...transactions])
      setIsProcessing(false)
      setShowReceipt(true)
      
      alert('✅ Payment successful! Digital receipt generated.')
    }, 2000)
  }

  const totalPaid = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = transactions
    .filter(t => t.status === 'Overdue')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Payment System</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-600">Current Due</h4>
          <p className="text-2xl font-bold">₹{paymentAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Due: 15th of each month</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-600">Total Paid</h4>
          <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-600">Pending</h4>
          <p className="text-2xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Payment Amount (₹)</label>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
          className="w-full p-3 border rounded-lg"
          min="0"
        />
      </div>
      
      <button
        onClick={handlePayment}
        disabled={isProcessing || paymentAmount <= 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 mb-6"
      >
        {isProcessing ? 'Processing Payment...' : `Pay ₹${paymentAmount.toLocaleString()}`}
      </button>
      
      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4">Recent Transactions</h4>
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">{txn.type}</p>
                <p className="text-sm text-gray-500">{txn.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${txn.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{txn.amount.toLocaleString()}
                </p>
                <span className={`text-sm px-2 py-1 rounded ${txn.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showReceipt && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-700 mb-2">📄 Digital Receipt Generated</h4>
          <p className="text-sm text-green-600">
            Receipt for ₹{paymentAmount.toLocaleString()} has been saved to your account.
            You can download it from Transaction History.
          </p>
        </div>
      )}
    </div>
  )
}