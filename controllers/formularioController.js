const db = require('../db/db');
const { notificarNuevoLead } = require('./notificarLead');

// Crear nuevo formulario
const crearFormulario = async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  if (!nombre || !correo || !telefono || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = 'INSERT INTO formulario (nombre, correo, telefono, mensaje, estado) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, correo, telefono, mensaje, 'nuevo'], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });

    await notificarNuevoLead({ nombre, correo, telefono, mensaje });

    res.status(201).json({ message: 'Formulario guardado', id: result.insertId });
  });
};

// Obtener todos los formularios
const obtenerFormularios = (req, res) => {
  db.query('SELECT * FROM formulario', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.status(200).json(results);
  });
};

// Obtener formulario por ID
const obtenerFormularioPorId = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM formulario WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Formulario no encontrado' });

    res.status(200).json(results[0]);
  });
};

// Actualizar formulario
const actualizarFormulario = (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, mensaje } = req.body;

  const sql = 'UPDATE formulario SET nombre = ?, correo = ?, telefono = ?, mensaje = ? WHERE id = ?';
  db.query(sql, [nombre, correo, telefono, mensaje, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Formulario no encontrado' });

    res.status(200).json({ message: 'Formulario actualizado' });
  });
};

// Eliminar formulario
const eliminarFormulario = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM formulario WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Formulario no encontrado' });

    res.status(200).json({ message: 'Formulario eliminado' });
  });
};

// Actualizar estado
const actualizarEstadoFormulario = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['nuevo', 'contactado', 'descartado'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  db.query('UPDATE formulario SET estado = ? WHERE id = ?', [estado, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Formulario no encontrado' });

    res.status(200).json({ message: 'Estado actualizado' });
  });
};

module.exports = {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  eliminarFormulario,
  actualizarEstadoFormulario,
};
