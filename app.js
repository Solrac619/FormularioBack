const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());


app.post('/api/formulario', (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  if (!nombre || !correo || !telefono || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = 'INSERT INTO formulario (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, correo, telefono, mensaje], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.status(201).json({ message: 'Formulario guardado', id: result.insertId });
  });
});


app.get('/api/formulario', (req, res) => {
  db.query('SELECT * FROM formulario', (err, results) => {
    if (err) {
      console.error('❌ Error al consultar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.status(200).json(results);
  });
});

app.get('/api/formulario/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM formulario WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al consultar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.status(200).json(results[0]);
  });
});

app.put('/api/formulario/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, mensaje } = req.body;

  const sql = 'UPDATE formulario SET nombre = ?, correo = ?, telefono = ?, mensaje = ? WHERE id = ?';
  db.query(sql, [nombre, correo, telefono, mensaje, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.status(200).json({ message: 'Formulario actualizado' });
  });
});


app.delete('/api/formulario/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM formulario WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.status(200).json({ message: 'Formulario eliminado' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
