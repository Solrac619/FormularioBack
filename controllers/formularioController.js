const db = require('../db/db');
const { notificarNuevoLead } = require('./notificarLead');

// Helper para convertir db.query en promesa
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Crear nuevo formulario
const crearFormulario = async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  if (!nombre || !correo || !telefono || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = 'INSERT INTO formulario (nombre, correo, telefono, mensaje, estado) VALUES (?, ?, ?, ?, ?)';

  try {
    const result = await query(sql, [nombre, correo, telefono, mensaje, 'nuevo']);

    try {
      await notificarNuevoLead({ nombre, correo, telefono, mensaje });
    } catch (err) {
      console.error('❌ Error al enviar correo:', err.message);
      // No interrumpimos el flujo si falla el correo
    }

    res.status(201).json({ message: 'Formulario guardado', id: result.insertId });
  } catch (error) {
    console.error('❌ Error al crear formulario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los formularios
const obtenerFormularios = async (req, res) => {
  try {
    const formularios = await query('SELECT * FROM formulario');
    res.status(200).json(formularios);
  } catch (error) {
    console.error('❌ Error al obtener formularios:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener formulario por ID
const obtenerFormularioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const resultados = await query('SELECT * FROM formulario WHERE id = ?', [id]);

    if (resultados.length === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.status(200).json(resultados[0]);
  } catch (error) {
    console.error('❌ Error al obtener formulario:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar formulario
const actualizarFormulario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, mensaje } = req.body;

  const sql = 'UPDATE formulario SET nombre = ?, correo = ?, telefono = ?, mensaje = ? WHERE id = ?';

  try {
    const result = await query(sql, [nombre, correo, telefono, mensaje, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.status(200).json({ message: 'Formulario actualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar formulario:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar formulario
const eliminarFormulario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM formulario WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.status(200).json({ message: 'Formulario eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar formulario:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar estado del formulario
const actualizarEstadoFormulario = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['nuevo', 'contactado', 'descartado'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const result = await query('UPDATE formulario SET estado = ? WHERE id = ?', [estado, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.status(200).json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  eliminarFormulario,
  actualizarEstadoFormulario,
};
