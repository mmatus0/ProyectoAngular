const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /api/login
const login = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ ok: false, mensaje: 'login y password son requeridos.' });
  }

  try {
    // Acepta email o nombre de usuario (igual que el Laravel original)
    const esEmail = login.includes('@');
    const campo   = esEmail ? 'email' : 'usuario';

    const [rows] = await db.query(
      `SELECT u.*, r.rolusuario, e.empresa
       FROM user u
       LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
       LEFT JOIN empresa e ON e.id = u.empresa_id
       WHERE u.${campo} = ? AND u.estado_id = 1
       LIMIT 1`,
      [login]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
    }

    const usuario = rows[0];

    const hashCompatible = usuario.password.replace(/^\$2y\$/, '$2b$');
    const passwordValido = await bcrypt.compare(password, hashCompatible);
    if (!passwordValido) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
    }

    const payload = {
      id:         usuario.id,
      nombre:     usuario.nombre,
      email:      usuario.email,
      usuario:    usuario.usuario,
      rol:        usuario.rolusuario,
      rol_id:     usuario.rolusuario_id,
      empresa_id: usuario.empresa_id,
      avatar:     usuario.ruta_avatar,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    return res.json({
      ok:      true,
      token,
      usuario: payload
    });

  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/logout
const logout = (req, res) => {
  // JWT es stateless — el cliente simplemente elimina el token
  return res.json({ ok: true, mensaje: 'Sesión cerrada.' });
};

// GET /api/me
const me = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.nombre, u.email, u.usuario, u.rolusuario_id,
              u.ruta_avatar, r.rolusuario, e.empresa
       FROM user u
       LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
       LEFT JOIN empresa e ON e.id = u.empresa_id
       WHERE u.id = ?`,
      [req.usuario.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
    }

    return res.json({ ok: true, usuario: rows[0] });
  } catch (err) {
    console.error('Error en me:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { login, logout, me };
