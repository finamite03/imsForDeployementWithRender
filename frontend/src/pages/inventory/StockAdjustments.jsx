import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockAdjustment() {
  const [skus, setSkus] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({ sku: '', warehouse: '', adjustmentType: 'increase', quantity: 1, reason: '' });

  useEffect(() => {
    axios.get('/api/skus').then(res => setSkus(res.data.skus || res.data));
    axios.get('/api/warehouses').then(res => setWarehouses(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/stock-adjustments', form);
    alert('Stock adjusted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="sku" value={form.sku} onChange={handleChange} required>
        <option value="">Select SKU</option>
        {skus.map(sku => <option key={sku._id} value={sku._id}>{sku.name}</option>)}
      </select>
      <select name="warehouse" value={form.warehouse} onChange={handleChange} required>
        <option value="">Select Warehouse</option>
        {warehouses.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
      </select>
      <select name="adjustmentType" value={form.adjustmentType} onChange={handleChange}>
        <option value="increase">Increase</option>
        <option value="decrease">Decrease</option>
      </select>
      <input type="number" name="quantity" value={form.quantity} min={1} onChange={handleChange} required />
      <input type="text" name="reason" value={form.reason} onChange={handleChange} placeholder="Reason" />
      <button type="submit">Adjust Stock</button>
    </form>
  );
}

export default StockAdjustment;