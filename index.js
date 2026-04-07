const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.post('/cars', (req, res) => {
  const { PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
  if (!PlateNumber || !Type || !Model || ManufacturingYear == null || !DriverPhone || !MechanicName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = `INSERT INTO Car (PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName)
    VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ message: 'Car created', PlateNumber });
  });
});

app.post('/services', (req, res) => {
  const { ServiceCode, ServiceName, ServicePrice } = req.body;
  if (!ServiceCode || !ServiceName || ServicePrice == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES (?, ?, ?)';
  db.query(sql, [ServiceCode, ServiceName, ServicePrice], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ message: 'Service created', ServiceCode });
  });
});

app.post('/records', (req, res) => {
  const { ServiceDate, PlateNumber, ServiceCode } = req.body;
  if (!ServiceDate || !PlateNumber || !ServiceCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO ServiceRecord (ServiceDate, PlateNumber, ServiceCode) VALUES (?, ?, ?)';
  db.query(sql, [ServiceDate, PlateNumber, ServiceCode], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({
      message: 'Service record created',
      RecordNumber: result.insertId,
    });
  });
});

app.get('/records', (req, res) => {
  db.query('SELECT * FROM ServiceRecord ORDER BY RecordNumber', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(rows);
  });
});

app.get('/records/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid RecordNumber' });
  }
  db.query('SELECT * FROM ServiceRecord WHERE RecordNumber = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service record not found' });
    }
    return res.status(200).json(rows[0]);
  });
});

app.put('/records/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid RecordNumber' });
  }
  const { ServiceDate, PlateNumber, ServiceCode } = req.body;
  if (!ServiceDate || !PlateNumber || !ServiceCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql =
    'UPDATE ServiceRecord SET ServiceDate = ?, PlateNumber = ?, ServiceCode = ? WHERE RecordNumber = ?';
  db.query(sql, [ServiceDate, PlateNumber, ServiceCode, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service record not found' });
    }
    return res.status(200).json({ message: 'Service record updated', RecordNumber: id });
  });
});

app.delete('/records/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid RecordNumber' });
  }
  db.query('DELETE FROM ServiceRecord WHERE RecordNumber = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service record not found' });
    }
    return res.status(200).json({ message: 'Service record deleted', RecordNumber: id });
  });
});

app.post('/payments', (req, res) => {
  const { AmountPaid, PaymentDate, RecordNumber } = req.body;
  if (AmountPaid == null || !PaymentDate || RecordNumber == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?)';
  db.query(sql, [AmountPaid, PaymentDate, RecordNumber], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({
      message: 'Payment created',
      PaymentNumber: result.insertId,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
