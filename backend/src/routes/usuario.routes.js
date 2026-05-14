const express = require('express');
const router  = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const {
  getUsuarios,
  getFormData,
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario
} = require('../controllers/usuario.controller');

// Todas las rutas de usuarios requieren token
router.use(verificarToken);

router.get('/',              getUsuarios);
router.get('/form-data',     getFormData);
router.get('/:id',           getUsuario);
router.post('/',             crearUsuario);
router.put('/:id',           actualizarUsuario);
router.delete('/:id',        desactivarUsuario);
router.post('/:id/activar',  activarUsuario);

module.exports = router;
