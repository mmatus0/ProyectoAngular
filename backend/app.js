var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var multer     = require('multer');
var XLSX       = require('xlsx');
var fs         = require('fs');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcrypt');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ── Clave secreta JWT (patrón del curso) ──────────────────────────────────────
const SECRET_KEY = 'clave_secreta_evalcoach';

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// ── Conexión MySQL con reconexión automática ──────────────────────────────────
var conn;

function conectar() {
    conn = mysql.createConnection({
        host:     'localhost',
        user:     'root',
        password: '',
        database: 'coachingnew'
    });

    conn.connect((err) => {
        if (err) {
            console.error('Error conectando a MySQL:', err.message);
            setTimeout(conectar, 2000);
        } else {
            console.log('Conectado a MySQL correctamente.');
        }
    });

    conn.on('error', (err) => {
        console.error('Error MySQL:', err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            conectar();
        } else {
            throw err;
        }
    });
}

conectar();

// ── Multer para carga masiva ──────────────────────────────────────────────────
var upload = multer({ storage: multer.memoryStorage() });

// ── Middleware JWT ────────────────────────────────────────────────────────────
// OJO: debe ubicarse DESPUÉS de /api/login, sino el login quedará privado
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ ok: false, mensaje: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
        }
        req.usuario = decoded;
        next();
    });
}

// ── GET /api/health ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ ok: true, mensaje: 'Backend EvalCoach funcionando' });
});

// ── POST /api/login ───────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ ok: false, mensaje: 'login y password son requeridos.' });
    }

    const esEmail = login.includes('@');
    const campo   = esEmail ? 'email' : 'usuario';

    const sql = `SELECT u.*, r.rolusuario, e.empresa
                 FROM user u
                 LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
                 LEFT JOIN empresa e ON e.id = u.empresa_id
                 WHERE u.${campo} = ? AND u.estado_id = 1
                 LIMIT 1`;

    conn.query(sql, [login], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (results.length === 0) return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });

        const usuario = results[0];
        const hashCompatible = usuario.password.replace(/^\$2y\$/, '$2b$');

        bcrypt.compare(password, hashCompatible, (errBcrypt, passwordValido) => {
            if (errBcrypt || !passwordValido) {
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
                avatar:     usuario.ruta_avatar
            };

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' });
            res.json({ ok: true, token, usuario: payload });
        });
    });
});

// ── POST /api/logout ──────────────────────────────────────────────────────────
app.post('/api/logout', verificarToken, (req, res) => {
    res.json({ ok: true, mensaje: 'Sesión cerrada.' });
});

// ── GET /api/me ───────────────────────────────────────────────────────────────
app.get('/api/me', verificarToken, (req, res) => {
    const sql = `SELECT u.id, u.nombre, u.email, u.usuario, u.rolusuario_id,
                        u.ruta_avatar, r.rolusuario, e.empresa
                 FROM user u
                 LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
                 LEFT JOIN empresa e ON e.id = u.empresa_id
                 WHERE u.id = ?`;

    conn.query(sql, [req.usuario.id], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (results.length === 0) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
        res.json({ ok: true, usuario: results[0] });
    });
});

// ── GET /api/usuarios ─────────────────────────────────────────────────────────
app.get('/api/usuarios', verificarToken, (req, res) => {
    const estado = req.query.estado || 1;
    const sql = `SELECT u.id, u.nombre, u.usuario, u.email,
                        u.estado_id, u.rolusuario_id, u.acreditado,
                        u.eval_asignadas, u.disc_asignados,
                        COALESCE(u.ruta_avatar, '') as avatar,
                        COALESCE(e.empresa, '') as empresa,
                        COALESCE(r.rolusuario, '') as rol,
                        es.nombre as estado,
                        COALESCE(m.nombre, 'Sin plan') as membresia
                 FROM user u
                 LEFT JOIN empresa e     ON e.id  = u.empresa_id
                 LEFT JOIN rol_usuario r ON r.id  = u.rolusuario_id
                 LEFT JOIN estado es     ON es.id = u.estado_id
                 LEFT JOIN membresia_usuario mu ON mu.usuario_id = u.id
                 LEFT JOIN membresia m   ON m.id  = mu.membresia_id
                 WHERE u.estado_id = ?
                 ORDER BY u.nombre`;

    conn.query(sql, [estado], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/usuarios/form-data ───────────────────────────────────────────────
app.get('/api/usuarios/form-data', verificarToken, (req, res) => {
    conn.query('SELECT id, rolusuario FROM rol_usuario ORDER BY rolusuario', (err, roles) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        conn.query('SELECT id, empresa FROM empresa ORDER BY empresa', (err2, empresas) => {
            if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });
            conn.query('SELECT id, nombre FROM membresia ORDER BY nombre', (err3, membresias) => {
                if (err3) return res.status(500).json({ ok: false, mensaje: err3.message });
                res.json({ ok: true, roles, empresas, membresias });
            });
        });
    });
});

// ── GET /api/usuarios/:id ─────────────────────────────────────────────────────
app.get('/api/usuarios/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const sql = `SELECT u.*,
                        p.rut, p.telefono, p.fecha_nacimiento, p.pais, p.ciudad,
                        p.direccion, p.tiempo_compania, p.tiempo_cargo,
                        p.linkedin, p.instagram, p.x_twitter, p.facebook,
                        r.rolusuario, e.empresa
                 FROM user u
                 LEFT JOIN persona p     ON p.usuario_id = u.id
                 LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
                 LEFT JOIN empresa e     ON e.id = u.empresa_id
                 WHERE u.id = ?`;

    conn.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (results.length === 0) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
        res.json({ ok: true, data: results[0] });
    });
});

// ── POST /api/usuarios ────────────────────────────────────────────────────────
app.post('/api/usuarios', verificarToken, (req, res) => {
    const { nombre, usuario, email, password, rolusuario_id, empresa_id } = req.body;

    if (!nombre || !usuario || !email || !password || !rolusuario_id || !empresa_id) {
        return res.status(400).json({ ok: false, mensaje: 'Todos los campos son requeridos.' });
    }

    conn.query('SELECT id FROM user WHERE email = ? OR usuario = ?', [email, usuario], (err, existe) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (existe.length > 0) return res.status(400).json({ ok: false, mensaje: 'El email o usuario ya existe.' });

        bcrypt.hash(password, 10, (errHash, hash) => {
            if (errHash) return res.status(500).json({ ok: false, mensaje: errHash.message });

            const sql = `INSERT INTO user
                         (nombre, usuario, email, password, rolusuario_id, empresa_id,
                          estado_id, acreditado, eval_asignadas, disc_asignados, ruta_avatar)
                         VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, 0, 'images/users/default_avatar.png')`;

            conn.query(sql, [nombre, usuario, email, hash, rolusuario_id, empresa_id], (err2, result) => {
                if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });

                const nuevoId = result.insertId;
                conn.query(
                    'INSERT INTO persona (usuario_id, empresa_id, estado_id) VALUES (?, ?, 1)',
                    [nuevoId, empresa_id],
                    (err3) => {
                        if (err3) console.error('Error creando persona:', err3.message);
                        res.status(201).json({ ok: true, mensaje: 'Usuario creado correctamente.', id: nuevoId });
                    }
                );
            });
        });
    });
});

// ── PUT /api/usuarios/:id ─────────────────────────────────────────────────────
app.put('/api/usuarios/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, email, password, rolusuario_id, empresa_id,
            estado_id, eval_asignadas, disc_asignados, acreditado } = req.body;

    conn.query(
        'SELECT id FROM user WHERE (email = ? OR usuario = ?) AND id != ?',
        [email, usuario, id],
        (err, existe) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });
            if (existe.length > 0) return res.status(400).json({ ok: false, mensaje: 'El email o usuario ya existe.' });

            const hacerUpdate = (hash) => {
                let sql = `UPDATE user SET nombre=?, usuario=?, email=?,
                           rolusuario_id=?, empresa_id=?, estado_id=?,
                           eval_asignadas=?, disc_asignados=?, acreditado=?`;
                let params = [nombre, usuario, email, rolusuario_id, empresa_id,
                              estado_id || 1, eval_asignadas || 0, disc_asignados || 0, acreditado || 0];

                if (hash) { sql += ', password=?'; params.push(hash); }
                sql += ' WHERE id=?';
                params.push(id);

                conn.query(sql, params, (err2) => {
                    if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });
                    res.json({ ok: true, mensaje: 'Usuario actualizado correctamente.' });
                });
            };

            if (password) {
                bcrypt.hash(password, 10, (errHash, hash) => {
                    if (errHash) return res.status(500).json({ ok: false, mensaje: errHash.message });
                    hacerUpdate(hash);
                });
            } else {
                hacerUpdate(null);
            }
        }
    );
});

// ── DELETE /api/usuarios/:id ──────────────────────────────────────────────────
app.delete('/api/usuarios/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE user SET estado_id = 2 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        conn.query('UPDATE persona SET estado_id = 2 WHERE usuario_id = ?', [id], () => {
            res.json({ ok: true, mensaje: 'Usuario desactivado correctamente.' });
        });
    });
});

// ── POST /api/usuarios/:id/activar ────────────────────────────────────────────
app.post('/api/usuarios/:id/activar', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE user SET estado_id = 1 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        conn.query('UPDATE persona SET estado_id = 1 WHERE usuario_id = ?', [id], () => {
            res.json({ ok: true, mensaje: 'Usuario activado correctamente.' });
        });
    });
});

// ── POST /api/usuarios/carga-masiva ──────────────────────────────────────────
app.post('/api/usuarios/carga-masiva', verificarToken, upload.single('archivo'), (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, mensaje: 'No se recibió archivo.' });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
    const rows     = XLSX.utils.sheet_to_json(sheet);

    var creados = 0, errores = [], procesados = 0, total = rows.length;

    if (total === 0) return res.json({ ok: true, creados: 0, errores: [], mensaje: 'Archivo vacío.' });

    rows.forEach((row) => {
        const nombre  = row.nombre?.toString().trim() || row.Nombre?.toString().trim() || '';
        const usuario = row.usuario?.toString().trim() || row.Usuario?.toString().trim() || '';
        const email   = row.email?.toString().trim().toLowerCase() || row.Email?.toString().trim().toLowerCase() || '';
        const pass    = row.password?.toString().trim() || 'password123';
        const rolId   = row.rolusuario_id || 3;
        const empId   = row.empresa_id    || 1;

        if (!nombre || !usuario || !email) {
            errores.push(`Fila omitida: nombre/usuario/email vacío`);
            procesados++;
            if (procesados === total) res.json({ ok: true, creados, errores });
            return;
        }

        bcrypt.hash(pass, 10, (errHash, hash) => {
            if (errHash) {
                errores.push(`${usuario}: error hash`);
                procesados++;
                if (procesados === total) res.json({ ok: true, creados, errores });
                return;
            }

            const sql = `INSERT INTO user
                         (nombre, usuario, email, password, rolusuario_id, empresa_id,
                          estado_id, acreditado, eval_asignadas, disc_asignados, ruta_avatar)
                         VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, 0, 'images/users/default_avatar.png')`;

            conn.query(sql, [nombre, usuario, email, hash, rolId, empId], (err2, result) => {
                if (err2) {
                    errores.push(`${usuario}: ${err2.message}`);
                } else {
                    conn.query('INSERT INTO persona (usuario_id, empresa_id, estado_id) VALUES (?, ?, 1)',
                        [result.insertId, empId]);
                    creados++;
                }
                procesados++;
                if (procesados === total) res.json({ ok: true, creados, errores });
            });
        });
    });
});

// ── GET /api/faq ──────────────────────────────────────────────────────────────
app.get('/api/faq', verificarToken, (req, res) => {
    const sql = `SELECT id, categoria, pregunta, respuesta, orden
                 FROM faq
                 WHERE estado_id = 1
                 ORDER BY categoria, orden`;

    conn.query(sql, (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/perfil ───────────────────────────────────────────────────────────
app.get('/api/perfil', verificarToken, (req, res) => {
    const sql = `SELECT u.id, u.nombre, u.usuario, u.email, u.ruta_avatar,
                        u.rolusuario_id, u.empresa_id,
                        r.rolusuario, e.empresa,
                        p.rut, p.telefono, p.fecha_nacimiento, p.pais, p.ciudad,
                        p.direccion, p.tiempo_compania, p.tiempo_cargo,
                        p.linkedin, p.instagram, p.x_twitter, p.facebook,
                        p.pagina_web, p.observacion
                 FROM user u
                 LEFT JOIN rol_usuario r ON r.id = u.rolusuario_id
                 LEFT JOIN empresa e     ON e.id = u.empresa_id
                 LEFT JOIN persona p     ON p.usuario_id = u.id
                 WHERE u.id = ?`;

    conn.query(sql, [req.usuario.id], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (results.length === 0) return res.status(404).json({ ok: false, mensaje: 'Perfil no encontrado.' });
        res.json({ ok: true, data: results[0] });
    });
});

// ── PUT /api/perfil ───────────────────────────────────────────────────────────
app.put('/api/perfil', verificarToken, (req, res) => {
    const id = req.usuario.id;
    const { telefono, fecha_nacimiento, pais, ciudad, direccion,
            tiempo_compania, tiempo_cargo, linkedin, instagram,
            x_twitter, facebook, pagina_web, observacion } = req.body;

    const sql = `UPDATE persona SET
                    telefono=?, fecha_nacimiento=?, pais=?, ciudad=?,
                    direccion=?, tiempo_compania=?, tiempo_cargo=?,
                    linkedin=?, instagram=?, x_twitter=?, facebook=?,
                    pagina_web=?, observacion=?
                 WHERE usuario_id=?`;

    const params = [ telefono, fecha_nacimiento, pais, ciudad, direccion,
                     tiempo_compania, tiempo_cargo, linkedin, instagram,
                     x_twitter, facebook, pagina_web, observacion, id ];

    conn.query(sql, params, (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Perfil actualizado correctamente.' });
    });
});

// ── GET /api/sesiones ─────────────────────────────────────────────────────────
app.get('/api/sesiones', verificarToken, (req, res) => {
    const estado = req.query.estado || 1;
    const sql = `SELECT s.id, s.nombre_sesion, s.fecha_sesion, s.lugar,
                        s.duracion, s.segundos, s.estado_id,
                        e.nombre as estado,
                        u.nombre as cliente
                 FROM sesion s
                 LEFT JOIN estado e  ON e.id = s.estado_id
                 LEFT JOIN user u    ON u.id = s.usuario_id
                 WHERE s.estado_id = ?
                 ORDER BY s.fecha_sesion DESC`;

    conn.query(sql, [estado], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/sesiones/form-data ───────────────────────────────────────────────
app.get('/api/sesiones/form-data', verificarToken, (req, res) => {
    conn.query('SELECT id, nombre FROM user WHERE estado_id = 1 ORDER BY nombre', (err, usuarios) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, usuarios });
    });
});

// ── POST /api/sesiones ────────────────────────────────────────────────────────
app.post('/api/sesiones', verificarToken, (req, res) => {
    const { nombre_sesion, fecha_sesion, lugar, usuario_id } = req.body;
    if (!nombre_sesion || !usuario_id) {
        return res.status(400).json({ ok: false, mensaje: 'Nombre y cliente son requeridos.' });
    }
    const sql = `INSERT INTO sesion (nombre_sesion, fecha_sesion, lugar, usuario_id, estado_id, duracion, segundos)
                 VALUES (?, ?, ?, ?, 1, 0, 0)`;
    conn.query(sql, [nombre_sesion, fecha_sesion, lugar, usuario_id], (err, result) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.status(201).json({ ok: true, mensaje: 'Sesión creada correctamente.', id: result.insertId });
    });
});

// ── PUT /api/sesiones/:id ─────────────────────────────────────────────────────
app.put('/api/sesiones/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { nombre_sesion, fecha_sesion, lugar, usuario_id } = req.body;
    const sql = `UPDATE sesion SET nombre_sesion=?, fecha_sesion=?, lugar=?, usuario_id=? WHERE id=?`;
    conn.query(sql, [nombre_sesion, fecha_sesion, lugar, usuario_id, id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Sesión actualizada correctamente.' });
    });
});

// ── DELETE /api/sesiones/:id ──────────────────────────────────────────────────
app.delete('/api/sesiones/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE sesion SET estado_id = 2 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Sesión desactivada correctamente.' });
    });
});

// ── POST /api/sesiones/:id/activar ────────────────────────────────────────────
app.post('/api/sesiones/:id/activar', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE sesion SET estado_id = 1 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Sesión activada correctamente.' });
    });
});

// ── POST /api/sesiones/:id/finalizar ─────────────────────────────────────────
app.post('/api/sesiones/:id/finalizar', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE sesion SET estado_id = 4 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Sesión finalizada correctamente.' });
    });
});

// ── GET /api/sesiones/:id/detalle ─────────────────────────────────────────────
app.get('/api/sesiones/:id/detalle', verificarToken, (req, res) => {
    const { id } = req.params;
    const sqlSesion = `SELECT s.*, u.nombre as cliente
                       FROM sesion s
                       LEFT JOIN user u ON u.id = s.usuario_id
                       WHERE s.id = ?`;

    conn.query(sqlSesion, [id], (err, sesiones) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (sesiones.length === 0) return res.status(404).json({ ok: false, mensaje: 'Sesión no encontrada.' });

        const sesion = sesiones[0];

        conn.query('SELECT * FROM tipo_contenido WHERE estado_id = 1 ORDER BY orden', (err2, tipos) => {
            if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });

            conn.query('SELECT * FROM actividad WHERE sesion_id = ?', [id], (err3, actividades) => {
                if (err3) return res.status(500).json({ ok: false, mensaje: err3.message });

                const actividadesMap = {};
                actividades.forEach(a => { actividadesMap[a.tipo_contenido_id] = a.actividad; });

                res.json({ ok: true, sesion, tipos, actividades: actividadesMap });
            });
        });
    });
});

// ── PUT /api/sesiones/:id/detalle ─────────────────────────────────────────────
app.put('/api/sesiones/:id/detalle', verificarToken, (req, res) => {
    const { id } = req.params;
    const { actividades, duracion, segundos } = req.body;

    const actualizarTiempo = (cb) => {
        if (duracion !== undefined && segundos !== undefined) {
            conn.query('UPDATE sesion SET duracion=?, segundos=? WHERE id=?',
                [duracion, segundos, id], cb);
        } else { cb(null); }
    };

    actualizarTiempo((err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (!actividades || Object.keys(actividades).length === 0) {
            return res.json({ ok: true, mensaje: 'Tiempo actualizado.' });
        }

        const entries = Object.entries(actividades);
        let procesados = 0;

        entries.forEach(([tipoId, texto]) => {
            conn.query(
                'SELECT id FROM actividad WHERE sesion_id = ? AND tipo_contenido_id = ?',
                [id, tipoId],
                (err2, existe) => {
                    if (err2) { procesados++; if (procesados === entries.length) res.json({ ok: true }); return; }

                    if (existe.length > 0) {
                        conn.query('UPDATE actividad SET actividad=? WHERE sesion_id=? AND tipo_contenido_id=?',
                            [texto, id, tipoId], () => {
                                procesados++;
                                if (procesados === entries.length) res.json({ ok: true, mensaje: 'Actividades guardadas.' });
                            });
                    } else {
                        conn.query('INSERT INTO actividad (actividad, sesion_id, tipo_contenido_id, estado_id) VALUES (?,?,?,1)',
                            [texto, id, tipoId], () => {
                                procesados++;
                                if (procesados === entries.length) res.json({ ok: true, mensaje: 'Actividades guardadas.' });
                            });
                    }
                }
            );
        });
    });
});

// ── PUT /api/sesiones/:id/finalizar-detalle ───────────────────────────────────
app.put('/api/sesiones/:id/finalizar-detalle', verificarToken, (req, res) => {
    const { id } = req.params;
    const { actividades, duracion, segundos } = req.body;

    conn.query('UPDATE sesion SET estado_id=4, duracion=?, segundos=? WHERE id=?',
        [duracion || 0, segundos || 0, id], (err) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });

            if (!actividades || Object.keys(actividades).length === 0) {
                return res.json({ ok: true, mensaje: 'Sesión finalizada.' });
            }

            const entries = Object.entries(actividades);
            let procesados = 0;

            entries.forEach(([tipoId, texto]) => {
                conn.query(
                    'SELECT id FROM actividad WHERE sesion_id = ? AND tipo_contenido_id = ?',
                    [id, tipoId],
                    (err2, existe) => {
                        if (existe && existe.length > 0) {
                            conn.query('UPDATE actividad SET actividad=? WHERE sesion_id=? AND tipo_contenido_id=?',
                                [texto, id, tipoId], () => {
                                    procesados++;
                                    if (procesados === entries.length) res.json({ ok: true, mensaje: 'Sesión finalizada correctamente.' });
                                });
                        } else {
                            conn.query('INSERT INTO actividad (actividad, sesion_id, tipo_contenido_id, estado_id) VALUES (?,?,?,1)',
                                [texto, id, tipoId], () => {
                                    procesados++;
                                    if (procesados === entries.length) res.json({ ok: true, mensaje: 'Sesión finalizada correctamente.' });
                                });
                        }
                    }
                );
            });
        });
});

// ── GET /api/mis-sesiones ─────────────────────────────────────────────────────
app.get('/api/mis-sesiones', verificarToken, (req, res) => {
    const sql = `SELECT s.id, s.nombre_sesion, s.fecha_sesion, s.lugar,
                        s.duracion, s.segundos, s.estado_id,
                        e.nombre as estado
                 FROM sesion s
                 LEFT JOIN estado e ON e.id = s.estado_id
                 WHERE s.usuario_id = ? AND s.estado_id IN (1, 4)
                 ORDER BY s.fecha_sesion DESC`;

    conn.query(sql, [req.usuario.id], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/herramientas ─────────────────────────────────────────────────────
app.get('/api/herramientas', verificarToken, (req, res) => {
    const estado = req.query.estado || 1;
    const sql = `SELECT hu.id, hu.fecha, hu.estado_id,
                        u.id as usuario_id, u.nombre as usuario, u.email,
                        h.id as herramienta_id, h.nombre as herramienta, h.foto,
                        e.nombre as estado
                 FROM herramienta_usuario hu
                 LEFT JOIN user u         ON u.id  = hu.usuario_id
                 LEFT JOIN herramienta h  ON h.id  = hu.herramienta_id
                 LEFT JOIN estado e       ON e.id  = hu.estado_id
                 WHERE hu.estado_id = ?
                 ORDER BY hu.fecha DESC`;
    conn.query(sql, [estado], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/herramientas/catalogo ────────────────────────────────────────────
app.get('/api/herramientas/catalogo', verificarToken, (req, res) => {
    conn.query('SELECT id, nombre, descripcion, foto FROM herramienta WHERE estado_id = 1 ORDER BY nombre',
        (err, results) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });
            res.json({ ok: true, data: results });
        });
});

// ── GET /api/herramientas/form-data ───────────────────────────────────────────
app.get('/api/herramientas/form-data', verificarToken, (req, res) => {
    conn.query('SELECT id, nombre, email FROM user WHERE estado_id = 1 ORDER BY nombre', (err, usuarios) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        conn.query('SELECT id, nombre, foto FROM herramienta WHERE estado_id = 1 ORDER BY nombre', (err2, herramientas) => {
            if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });
            res.json({ ok: true, usuarios, herramientas });
        });
    });
});

// ── GET /api/herramientas/asignadas/:usuarioId ────────────────────────────────
app.get('/api/herramientas/asignadas/:usuarioId', verificarToken, (req, res) => {
    const { usuarioId } = req.params;
    const sql = `SELECT herramienta_id FROM herramienta_usuario
                 WHERE usuario_id = ? AND estado_id = 1`;
    conn.query(sql, [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results.map(r => r.herramienta_id) });
    });
});

// ── POST /api/herramientas/asignar ────────────────────────────────────────────
app.post('/api/herramientas/asignar', verificarToken, (req, res) => {
    const { usuario_id, herramientas } = req.body;
    if (!usuario_id) return res.status(400).json({ ok: false, mensaje: 'usuario_id es requerido.' });

    // Desactivar todas las asignaciones actuales del usuario
    conn.query('UPDATE herramienta_usuario SET estado_id = 2 WHERE usuario_id = ?', [usuario_id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });

        if (!herramientas || herramientas.length === 0) {
            return res.json({ ok: true, mensaje: 'Asignaciones actualizadas.' });
        }

        let procesados = 0;
        herramientas.forEach(herrId => {
            // Verificar si ya existe registro
            conn.query(
                'SELECT id FROM herramienta_usuario WHERE usuario_id = ? AND herramienta_id = ?',
                [usuario_id, herrId],
                (err2, existe) => {
                    if (existe && existe.length > 0) {
                        conn.query('UPDATE herramienta_usuario SET estado_id = 1, fecha = NOW() WHERE usuario_id = ? AND herramienta_id = ?',
                            [usuario_id, herrId], () => {
                                procesados++;
                                if (procesados === herramientas.length)
                                    res.json({ ok: true, mensaje: 'Asignaciones guardadas correctamente.' });
                            });
                    } else {
                        conn.query('INSERT INTO herramienta_usuario (usuario_id, herramienta_id, estado_id, fecha) VALUES (?,?,1,NOW())',
                            [usuario_id, herrId], () => {
                                procesados++;
                                if (procesados === herramientas.length)
                                    res.json({ ok: true, mensaje: 'Asignaciones guardadas correctamente.' });
                            });
                    }
                }
            );
        });
    });
});

// ── DELETE /api/herramientas/:id ──────────────────────────────────────────────
app.delete('/api/herramientas/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE herramienta_usuario SET estado_id = 2 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Asignación desactivada correctamente.' });
    });
});

// ── POST /api/herramientas/:id/activar ────────────────────────────────────────
app.post('/api/herramientas/:id/activar', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE herramienta_usuario SET estado_id = 1 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Asignación activada correctamente.' });
    });
});

// ── GET /api/mis-herramientas ─────────────────────────────────────────────────
app.get('/api/mis-herramientas', verificarToken, (req, res) => {
    const sql = `SELECT hu.id, hu.fecha,
                        h.id as herramienta_id, h.nombre as herramienta,
                        h.descripcion, h.foto
                 FROM herramienta_usuario hu
                 LEFT JOIN herramienta h ON h.id = hu.herramienta_id
                 WHERE hu.usuario_id = ? AND hu.estado_id = 1
                 ORDER BY h.nombre`;

    conn.query(sql, [req.usuario.id], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/mis-herramientas/:id/cuadrantes ──────────────────────────────────
app.get('/api/mis-herramientas/:id/cuadrantes', verificarToken, (req, res) => {
    const { id } = req.params; // id = herramienta_usuario_id

    // Verificar que la asignación pertenece al usuario
    conn.query(
        'SELECT hu.id, h.nombre, h.descripcion FROM herramienta_usuario hu LEFT JOIN herramienta h ON h.id = hu.herramienta_id WHERE hu.id = ? AND hu.usuario_id = ?',
        [id, req.usuario.id],
        (err, herr) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });
            if (herr.length === 0) return res.status(403).json({ ok: false, mensaje: 'Sin acceso.' });

            // Obtener entidades (cuadrantes) de la herramienta
            const sqlEntidades = `SELECT e.id, e.entidad, e.tipo_entidad, e.sub_entidad, e.codigo_metodo
                                  FROM herramienta_entidad he
                                  LEFT JOIN entidad e ON e.id = he.entidad_id
                                  WHERE he.herramienta_id = (
                                      SELECT herramienta_id FROM herramienta_usuario WHERE id = ?
                                  ) AND he.estado_id = 1
                                  ORDER BY e.id`;

            conn.query(sqlEntidades, [id], (err2, entidades) => {
                if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });

                // Obtener atributos guardados
                conn.query(
                    'SELECT * FROM atributo WHERE herramienta_usuario_id = ? AND estado_id = 1 ORDER BY fecha ASC',
                    [id],
                    (err3, atributos) => {
                        if (err3) return res.status(500).json({ ok: false, mensaje: err3.message });

                        // Agrupar atributos por entidad_id
                        const atributosMap = {};
                        atributos.forEach(a => {
                            if (!atributosMap[a.entidad_id]) atributosMap[a.entidad_id] = [];
                            atributosMap[a.entidad_id].push(a);
                        });

                        res.json({
                            ok: true,
                            herramienta: herr[0],
                            entidades,
                            atributos: atributosMap
                        });
                    }
                );
            });
        }
    );
});

// ── POST /api/mis-herramientas/:id/atributo ───────────────────────────────────
app.post('/api/mis-herramientas/:id/atributo', verificarToken, (req, res) => {
    const { id } = req.params;
    const { entidad_id, atributo } = req.body;

    if (!atributo || !entidad_id) {
        return res.status(400).json({ ok: false, mensaje: 'Datos incompletos.' });
    }

    const sql = `INSERT INTO atributo (atributo, herramienta_usuario_id, entidad_id, estado_id, fecha)
                 VALUES (?, ?, ?, 1, NOW())`;

    conn.query(sql, [atributo, id, entidad_id], (err, result) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, id: result.insertId, atributo, entidad_id });
    });
});

// ── PUT /api/mis-herramientas/atributo/:atributoId ────────────────────────────
app.put('/api/mis-herramientas/atributo/:atributoId', verificarToken, (req, res) => {
    const { atributoId } = req.params;
    const { atributo } = req.body;

    conn.query('UPDATE atributo SET atributo = ? WHERE id = ?', [atributo, atributoId], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Atributo actualizado.' });
    });
});

// ── DELETE /api/mis-herramientas/atributo/:atributoId ─────────────────────────
app.delete('/api/mis-herramientas/atributo/:atributoId', verificarToken, (req, res) => {
    const { atributoId } = req.params;

    conn.query('UPDATE atributo SET estado_id = 2 WHERE id = ?', [atributoId], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Atributo eliminado.' });
    });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(3000, () => {
    console.log('Servidor backend EvalCoach escuchando en puerto 3000');
});