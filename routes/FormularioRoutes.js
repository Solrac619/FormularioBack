const express = require('express');
const router = express.Router();
const { verificarToken } = require('../auth/auth');
const {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  eliminarFormulario,
  actualizarEstadoFormulario
} = require('../controllers/formularioController');

router.post('/', crearFormulario);
router.get('/', verificarToken, obtenerFormularios);
router.get('/:id', verificarToken, obtenerFormularioPorId);
router.put('/:id', verificarToken, actualizarFormulario);
router.delete('/:id', verificarToken, eliminarFormulario);
router.patch('/:id/estado', verificarToken, actualizarEstadoFormulario);

module.exports = router;
