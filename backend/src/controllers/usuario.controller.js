const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/usuarios?estado=1
const getUsuarios = async (req, res) => {
  const estado = req.query.estado ?? 1;

  try {
    const [rows] = await db.query(
      `SELECT
        u.id, u.nombre, u.usuario, u.email,
        u.estado_id, u.rolusuario_id, u.acreditado,
        u.eval_asignadas, u.disc_asignados,
        COALESCE(u.ruta_avatar, '') as avatar,
        COALESCE(e.empresa, '') as empresa,
        COALESCE(r.rolusuario, '') as rol,
        es.nombre as estado,
        COALESCE(m.nombre, 'Sin plan') as membresia
       FROM user u
       LEFT JOIN empresa e   ON e.id  = u.empresa_id
       LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
       LEFT JOIN estado es   ON es.id = u.estado_id
       LEFT JOIN membresia_usuario mu ON mu.usuario_id = u.id
       LEFT JOIN membresia m ON m.id = mu.membresia_id
       WHERE u.estado_id = ?
       ORDER BY u.nombre`,
      [estado]
    );

    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('Error getUsuarios:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener usuarios.' });
  }
};

// GET /api/usuarios/form-data
const getFormData = async (req, res) => {
  try {
    const [roles]     = await db.query('SELECT id, rolusuario FROM rol_usuario ORDER BY rolusuario');
    const [empresas]  = await db.query('SELECT id, empresa FROM empresa ORDER BY empresa');
    const [membresias]= await db.query('SELECT id, nombre FROM membresia ORDER BY nombre');

    return res.json({ ok: true, roles, empresas, membresias });
  } catch (err) {
    console.error('Error getFormData:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener datos del formulario.' });
  }
};

// GET /api/usuarios/:id
const getUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT u.*,
        p.rut, p.telefono, p.fecha_nacimiento, p.pais, p.ciudad,
        p.direccion, p.tiempo_compania, p.tiempo_cargo,
        p.linkedin, p.instagram, p.x_twitter, p.facebook,
        p.pagina_web, p.observacion, p.otra_informacion,
        r.rolusuario, e.empresa,
        mu.membresia_id, mu.fecha as membresia_fecha,
        mu.aplica_membresia, mu.herr_contratadas,
        mu.disc_contratados, mu.test_contratados,
        m.nombre as membresia_nombre
       FROM user u
       LEFT JOIN persona p   ON p.usuario_id = u.id
       LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
       LEFT JOIN empresa e   ON e.id = u.empresa_id
       LEFT JOIN membresia_usuario mu ON mu.usuario_id = u.id
       LEFT JOIN membresia m ON m.id = mu.membresia_id
       WHERE u.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
    }

    return res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error('Error getUsuario:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener usuario.' });
  }
};

// POST /api/usuarios
const crearUsuario = async (req, res) => {
  const { nombre, usuario, email, password, rolusuario_id, empresa_id } = req.body;

  if (!nombre || !usuario || !email || !password || !rolusuario_id || !empresa_id) {
    return res.status(400).json({ ok: false, mensaje: 'Todos los campos son requeridos.' });
  }

  try {
    // Verificar duplicados
    const [existe] = await db.query(
      'SELECT id FROM user WHERE email = ? OR usuario = ?',
      [email, usuario]
    );
    if (existe.length > 0) {
      return res.status(400).json({ ok: false, mensaje: 'El email o nombre de usuario ya existe.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO user
        (nombre, usuario, email, password, rolusuario_id, empresa_id,
         estado_id, acreditado, eval_asignadas, disc_asignados, ruta_avatar)
       VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, 0, 'images/users/default_avatar.png')`,
      [nombre, usuario, email, hash, rolusuario_id, empresa_id]
    );

    const nuevoId = result.insertId;

    // Crear registro en persona
    await db.query(
      'INSERT INTO persona (usuario_id, empresa_id, estado_id) VALUES (?, ?, 1)',
      [nuevoId, empresa_id]
    );

    return res.status(201).json({ ok: true, mensaje: 'Usuario creado correctamente.', id: nuevoId });
  } catch (err) {
    console.error('Error crearUsuario:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al crear usuario.' });
  }
};

// PUT /api/usuarios/:id
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre, usuario, email, password,
    rolusuario_id, empresa_id, estado_id,
    eval_asignadas, disc_asignados, acreditado,
    // persona
    rut, telefono, fecha_nacimiento, pais, ciudad,
    direccion, tiempo_compania, tiempo_cargo,
    linkedin, instagram, x_twitter, facebook,
    pagina_web, observacion, otra_informacion
  } = req.body;

  try {
    // Verificar duplicados excluyendo el usuario actual
    const [existe] = await db.query(
      'SELECT id FROM user WHERE (email = ? OR usuario = ?) AND id != ?',
      [email, usuario, id]
    );
    if (existe.length > 0) {
      return res.status(400).json({ ok: false, mensaje: 'El email o nombre de usuario ya existe.' });
    }

    let query = `UPDATE user SET
      nombre = ?, usuario = ?, email = ?,
      rolusuario_id = ?, empresa_id = ?, estado_id = ?,
      eval_asignadas = ?, disc_asignados = ?, acreditado = ?`;
    let params = [
      nombre, usuario, email,
      rolusuario_id, empresa_id, estado_id ?? 1,
      eval_asignadas ?? 0, disc_asignados ?? 0, acreditado ?? 0
    ];

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hash);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    // Actualizar persona
    await db.query(
      `INSERT INTO persona
        (usuario_id, empresa_id, estado_id, rut, telefono, fecha_nacimiento,
         pais, ciudad, direccion, tiempo_compania, tiempo_cargo,
         linkedin, instagram, x_twitter, facebook, pagina_web, observacion, otra_informacion)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        rut = VALUES(rut), telefono = VALUES(telefono),
        fecha_nacimiento = VALUES(fecha_nacimiento),
        pais = VALUES(pais), ciudad = VALUES(ciudad),
        direccion = VALUES(direccion),
        tiempo_compania = VALUES(tiempo_compania),
        tiempo_cargo = VALUES(tiempo_cargo),
        linkedin = VALUES(linkedin), instagram = VALUES(instagram),
        x_twitter = VALUES(x_twitter), facebook = VALUES(facebook),
        pagina_web = VALUES(pagina_web), observacion = VALUES(observacion),
        otra_informacion = VALUES(otra_informacion)`,
      [
        id, empresa_id ?? 1,
        rut ?? null, telefono ?? null, fecha_nacimiento ?? null,
        pais ?? null, ciudad ?? null, direccion ?? null,
        tiempo_compania ?? null, tiempo_cargo ?? null,
        linkedin ?? null, instagram ?? null, x_twitter ?? null,
        facebook ?? null, pagina_web ?? null, observacion ?? null,
        otra_informacion ?? null
      ]
    );

    return res.json({ ok: true, mensaje: 'Usuario actualizado correctamente.' });
  } catch (err) {
    console.error('Error actualizarUsuario:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al actualizar usuario.' });
  }
};

// DELETE /api/usuarios/:id  → desactiva (estado_id = 2)
const desactivarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE user SET estado_id = 2 WHERE id = ?', [id]);
    await db.query('UPDATE persona SET estado_id = 2 WHERE usuario_id = ?', [id]);
    await db.query('UPDATE membresia_usuario SET estado_id = 2 WHERE usuario_id = ?', [id]);

    return res.json({ ok: true, mensaje: 'Usuario desactivado correctamente.' });
  } catch (err) {
    console.error('Error desactivarUsuario:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al desactivar usuario.' });
  }
};

// POST /api/usuarios/:id/activar
const activarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE user SET estado_id = 1 WHERE id = ?', [id]);
    await db.query('UPDATE persona SET estado_id = 1 WHERE usuario_id = ?', [id]);
    await db.query('UPDATE membresia_usuario SET estado_id = 1 WHERE usuario_id = ?', [id]);

    return res.json({ ok: true, mensaje: 'Usuario activado correctamente.' });
  } catch (err) {
    console.error('Error activarUsuario:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al activar usuario.' });
  }
};

const multer = require('multer');
const XLSX   = require('xlsx');
const upload = multer({ storage: multer.memoryStorage() });

const cargaMasiva = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, mensaje: 'No se recibió archivo.' });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
    const rows     = XLSX.utils.sheet_to_json(sheet);

    const [roles]   = await db.query('SELECT id, rolusuario FROM rol_usuario');
    const [empresas]= await db.query('SELECT id, empresa FROM empresa');

    const rolesMap   = Object.fromEntries(roles.map(r => [r.rolusuario.toLowerCase(), r.id]));
    const empresasMap= Object.fromEntries(empresas.map(e => [e.empresa.toLowerCase(), e.id]));

    let creados = 0, actualizados = 0, errores = [];

    for (const row of rows) {
      const nombre   = row.nombre?.toString().trim();
      const usuario  = row.usuario?.toString().trim();
      const email    = row.email?.toString().trim().toLowerCase();
      const password = row.password?.toString().trim();

      if (!nombre || !usuario || !email) {
        errores.push(`Fila omitida: nombre/usuario/email vacío`);
        continue;
      }

      const rol_id = row.rolusuario_id
        ?? rolesMap[row.rolusuario?.toString().toLowerCase().trim()]
        ?? 3;

      const emp_id = row.empresa_id
        ?? empresasMap[row.empresa?.toString().toLowerCase().trim()]
        ?? 1;

      const [existe] = await db.query(
        'SELECT id FROM user WHERE email = ? OR usuario = ?', [email, usuario]
      );

      if (existe.length > 0) {
        await db.query(
          `UPDATE user SET nombre=?, rolusuario_id=?, empresa_id=? WHERE id=?`,
          [nombre, rol_id, emp_id, existe[0].id]
        );
        actualizados++;
      } else {
        const hash = password
          ? await require('bcryptjs').hash(password, 10)
          : await require('bcryptjs').hash('password123', 10);

        const [result] = await db.query(
          `INSERT INTO user (nombre, usuario, email, password, rolusuario_id, empresa_id, estado_id, acreditado, eval_asignadas, disc_asignados, ruta_avatar)
           VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, 0, 'images/users/default_avatar.png')`,
          [nombre, usuario, email, hash, rol_id, emp_id]
        );
        await db.query(
          'INSERT INTO persona (usuario_id, empresa_id, estado_id) VALUES (?, ?, 1)',
          [result.insertId, emp_id]
        );
        creados++;
      }
    }

    return res.json({ ok: true, creados, actualizados, errores });
  } catch (err) {
    console.error('Error cargaMasiva:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error procesando el archivo.' });
  }
};

module.exports = {
  getUsuarios,
  getFormData,
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario, 
  cargaMasiva,
  upload
};
