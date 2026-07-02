var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var multer     = require('multer');
var XLSX       = require('xlsx');
var fs         = require('fs');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcrypt');
var bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Clave secreta JWT 
const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_evalcoach';

const path = require('path');

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200').split(',');

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión MySQL
var conn;

function conectar() {
    conn = mysql.createConnection({
        host:     process.env.DB_HOST || 'localhost',
        port:     process.env.DB_PORT || 3306,
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'coachingnew'
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

//  carga masiva 
var upload = multer({ storage: multer.memoryStorage() });

// Middleware JWT

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

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true, raw: false, dense: false });
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
    const rows     = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) return res.json({ ok: true, creados: 0, errores: [], mensaje: 'Archivo vacío.' });

    // Cargar roles y empresas para resolver nombres
    conn.query('SELECT id, rolusuario FROM rol_usuario', (errRol, roles) => {
        if (errRol) return res.status(500).json({ ok: false, mensaje: errRol.message });

        conn.query('SELECT id, empresa FROM empresa WHERE estado_id = 1', (errEmp, empresas) => {
            if (errEmp) return res.status(500).json({ ok: false, mensaje: errEmp.message });

            const rolMap = {};
            roles.forEach(r => { rolMap[r.rolusuario.toLowerCase()] = r.id; });
            // IDs directos como fallback
            rolMap['admin'] = rolMap['admin'] || 1;
            rolMap['coach'] = rolMap['coach'] || 2;
            rolMap['cliente'] = rolMap['cliente'] || 3;

            const empMap = {};
            empresas.forEach(e => { empMap[e.empresa.toLowerCase()] = e.id; });

            var creados = 0, errores = [], procesados = 0, total = rows.length;

            rows.forEach((row) => {
                const nombre  = (row.nombre  || row.Nombre  || '').toString().trim();
                const usuario = (row.usuario || row.Usuario || '').toString().trim();
                const email   = (row.email   || row.Email   || '').toString().trim().toLowerCase();
                const pass    = (row.password || 'password123').toString().trim();

                // Resolver rol — acepta nombre ("Cliente") o id (3)
                const rolRaw = (row.rolusuario || row.rolusuario_id || 'cliente').toString().trim().toLowerCase();
                const rolId  = rolMap[rolRaw] || parseInt(rolRaw) || 3;

                // Resolver empresa — acepta nombre ("Empresa Demo") o id
                const empRaw = (row.empresa || row.empresa_id || '').toString().trim().toLowerCase();
                const empId  = empMap[empRaw] || parseInt(empRaw) || 1;

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
                 INNER JOIN user u         ON u.id  = hu.usuario_id
                 INNER JOIN herramienta h  ON h.id  = hu.herramienta_id AND h.estado_id = 1
                 LEFT JOIN estado e        ON e.id  = hu.estado_id
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

// ── GET /api/evaluaciones ─────────────────────────────────────────────────────
app.get('/api/evaluaciones', verificarToken, (req, res) => {
    const estado = req.query.estado || 1;
    const sql = `SELECT eu.id, eu.intentos, eu.ver_resultados,
                        eu.fecha, eu.inicio, eu.finalizacion, eu.estado_id,
                        u.id as usuario_id, u.nombre as usuario, u.email,
                        e.id as evaluacion_id, e.nombre as evaluacion, e.foto,
                        es.nombre as estado
                 FROM evaluacion_usuario eu
                 INNER JOIN user u        ON u.id  = eu.usuario_id
                 INNER JOIN evaluacion e  ON e.id  = eu.evaluacion_id AND e.estado_id = 1
                 LEFT  JOIN estado es     ON es.id = eu.estado_id
                 WHERE eu.estado_id = ?
                   AND eu.usuario_id IS NOT NULL
                   AND eu.evaluacion_id IS NOT NULL
                 ORDER BY u.nombre, e.nombre`;

    conn.query(sql, [estado], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/evaluaciones/form-data ───────────────────────────────────────────
app.get('/api/evaluaciones/form-data', verificarToken, (req, res) => {
    conn.query('SELECT id, nombre FROM user WHERE estado_id = 1 ORDER BY nombre', (err, usuarios) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        conn.query('SELECT id, nombre FROM evaluacion WHERE estado_id = 1 ORDER BY nombre', (err2, evaluaciones) => {
            if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });
            res.json({ ok: true, usuarios, evaluaciones });
        });
    });
});

// ── POST /api/evaluaciones/asignar ────────────────────────────────────────────
app.post('/api/evaluaciones/asignar', verificarToken, (req, res) => {
    const { usuario_id, evaluacion_id, intentos, ver_resultados } = req.body;
    if (!usuario_id || !evaluacion_id) {
        return res.status(400).json({ ok: false, mensaje: 'usuario_id y evaluacion_id son requeridos.' });
    }

    conn.query(
        'SELECT evaluacion_id FROM evaluacion_usuario WHERE usuario_id = ? AND estado_id IN (1, 3, 4)',
        [usuario_id, evaluacion_id],
        (err, existe) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });
            if (existe.length > 0) {
                return res.status(400).json({ ok: false, mensaje: 'Esta evaluación ya está asignada a este usuario.' });
            }

            const sql = `INSERT INTO evaluacion_usuario
                         (usuario_id, evaluacion_id, intentos, ver_resultados, estado_id, fecha)
                         VALUES (?, ?, ?, ?, 1, NOW())`;
            conn.query(sql, [usuario_id, evaluacion_id, intentos || 1, ver_resultados || 0], (err2, result) => {
                if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });
                res.status(201).json({ ok: true, mensaje: 'Evaluación asignada correctamente.', id: result.insertId });
            });
        }
    );
});

// ── PUT /api/evaluaciones/:id ─────────────────────────────────────────────────
app.put('/api/evaluaciones/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { intentos, ver_resultados } = req.body;
    conn.query(
        'UPDATE evaluacion_usuario SET intentos=?, ver_resultados=? WHERE id=?',
        [intentos, ver_resultados, id],
        (err) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });
            res.json({ ok: true, mensaje: 'Evaluación actualizada correctamente.' });
        }
    );
});

// ── DELETE /api/evaluaciones/:id ──────────────────────────────────────────────
app.delete('/api/evaluaciones/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE evaluacion_usuario SET estado_id = 2 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Evaluación desactivada correctamente.' });
    });
});

// ── POST /api/evaluaciones/:id/activar ────────────────────────────────────────
app.post('/api/evaluaciones/:id/activar', verificarToken, (req, res) => {
    const { id } = req.params;
    conn.query('UPDATE evaluacion_usuario SET estado_id = 1 WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, mensaje: 'Evaluación activada correctamente.' });
    });
});

// ── GET /api/mis-evaluaciones ─────────────────────────────────────────────────
app.get('/api/mis-evaluaciones', verificarToken, (req, res) => {
    const sql = `SELECT eu.id, eu.intentos, eu.ver_resultados,
                        eu.fecha, eu.inicio, eu.finalizacion, eu.estado_id,
                        e.id as evaluacion_id, e.nombre, e.descripcion, e.foto,
                        e.instrucciones
                 FROM evaluacion_usuario eu
                 INNER JOIN evaluacion e ON e.id = eu.evaluacion_id AND e.estado_id = 1
                 WHERE eu.usuario_id = ? AND eu.estado_id IN (1, 3, 4)
                 ORDER BY e.nombre`;

    conn.query(sql, [req.usuario.id], (err, results) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        res.json({ ok: true, data: results });
    });
});

// ── GET /api/mis-evaluaciones/:id/test ───────────────────────────────────────
app.get('/api/mis-evaluaciones/:id/test', verificarToken, (req, res) => {
    const { id } = req.params;

    const sqlEval = `SELECT eu.id, eu.estado_id, eu.ver_resultados,
                            e.id as evaluacion_id, e.nombre, e.descripcion,
                            e.instrucciones, e.nro_alternativas
                     FROM evaluacion_usuario eu
                     INNER JOIN evaluacion e ON e.id = eu.evaluacion_id
                     WHERE eu.id = ? AND eu.usuario_id = ?`;

    conn.query(sqlEval, [id, req.usuario.id], (err, evals) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (evals.length === 0) return res.status(403).json({ ok: false, mensaje: 'Sin acceso.' });

        const ev = evals[0];

        const sqlPregs = `SELECT p.id, p.enunciado, p.numero, p.dimension_id
                          FROM preguntas p
                          WHERE p.evaluacion_id = ? AND p.estado_id = 1
                          ORDER BY p.numero ASC`;

        conn.query(sqlPregs, [ev.evaluacion_id], (err2, preguntas) => {
            if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });

            const sqlAlts = `SELECT id, alternativa, score, letra, cuadrante, grupo, pregunta_id
                             FROM alternativas
                             WHERE evaluacion_id = ? AND estado_id = 1
                             ORDER BY pregunta_id, id ASC`;

            conn.query(sqlAlts, [ev.evaluacion_id], (err3, alternativas) => {
                if (err3) return res.status(500).json({ ok: false, mensaje: err3.message });

                // Obtener respuestas guardadas
                const sqlResp = `SELECT dr.alternativa_id, dr.pregunta_id
                                 FROM respuestas r
                                 INNER JOIN detalle_respuesta dr ON dr.respuesta_id = r.id AND dr.estado_id = 1
                                 WHERE r.evaluacion_usuario_id = ? AND r.estado_id = 1`;

                conn.query(sqlResp, [id], (err4, respuestas) => {
                    if (err4) return res.status(500).json({ ok: false, mensaje: err4.message });

                    const respuestasMap = {};
                    respuestas.forEach((r) => {
                        respuestasMap[r.pregunta_id] = r.alternativa_id;
                    });

                    console.log('Respuestas cargadas:', JSON.stringify(respuestasMap));
                    console.log('Preguntas IDs:', preguntas.map(p => p.id));

                    res.json({ ok: true, evaluacion: ev, preguntas, alternativas, respuestas: respuestasMap });
                });
            });
        });
    });
});

// ── POST /api/mis-evaluaciones/:id/guardar ────────────────────────────────
app.post('/api/mis-evaluaciones/:id/guardar', verificarToken, (req, res) => {
    const { id } = req.params;
    const { respuestas, finalizar } = req.body;

    const sqlEval = `SELECT eu.id, eu.estado_id, e.id as evaluacion_id, e.nro_alternativas
                     FROM evaluacion_usuario eu
                     INNER JOIN evaluacion e ON e.id = eu.evaluacion_id
                     WHERE eu.id = ? AND eu.usuario_id = ?`;

    conn.query(sqlEval, [id, req.usuario.id], (err, evals) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (evals.length === 0) return res.status(403).json({ ok: false, mensaje: 'Sin acceso.' });

        const ev = evals[0];
        const esDisc = ev.evaluacion_id === 10;

        if (ev.estado_id === 4) {
            return res.status(400).json({ ok: false, mensaje: 'Esta evaluación ya fue finalizada.' });
        }

        // Marcar inicio si es primera vez
        conn.query(
            `UPDATE evaluacion_usuario SET inicio = COALESCE(inicio, NOW()), estado_id = 3 WHERE id = ? AND estado_id = 1`,
            [id], () => {}
        );

        const crearOUsarRespuesta = (cb) => {
            conn.query('SELECT id FROM respuestas WHERE evaluacion_usuario_id = ? LIMIT 1', [id], (err, rows) => {
                if (err) return res.status(500).json({ ok: false, mensaje: err.message });
                if (rows.length > 0) return cb(rows[0].id);
                conn.query(
                    'INSERT INTO respuestas (evaluacion_usuario_id, estado_id, fecha, nro_intentos) VALUES (?, 1, NOW(), 1)',
                    [id], (err2, result) => {
                        if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });
                        cb(result.insertId);
                    }
                );
            });
        };

        crearOUsarRespuesta((respuestaId) => {

            if (esDisc) {
                // ── Guardar respuestas DISC (mas=1, menos=-1) ─────────────────
                const entries = Object.entries(respuestas || {});
                let idx = 0;
                const siguiente = () => {
                    if (idx >= entries.length) {
                        if (finalizar) return finalizarEval();
                        return res.json({ ok: true, mensaje: 'Avance DISC guardado.' });
                    }
                    const [pregId, vals] = entries[idx++];
                    const { mas, menos } = vals;

                    const guardarAlt = (altId, resultado, next) => {
                        if (!altId) return next();
                        conn.query(
                            'SELECT id FROM detalle_respuesta WHERE respuesta_id = ? AND pregunta_id = ? AND resultado = ? LIMIT 1',
                            [respuestaId, pregId, resultado],
                            (err, rows) => {
                                if (err) return res.status(500).json({ ok: false, mensaje: err.message });
                                if (rows.length > 0) {
                                    conn.query(
                                        'UPDATE detalle_respuesta SET alternativa_id = ? WHERE id = ?',
                                        [altId, rows[0].id], next
                                    );
                                } else {
                                    conn.query(
                                        'INSERT INTO detalle_respuesta (respuesta_id, alternativa_id, pregunta_id, resultado, estado_id) VALUES (?,?,?,?,1)',
                                        [respuestaId, altId, pregId, resultado], next
                                    );
                                }
                            }
                        );
                    };

                    guardarAlt(mas, '1', () => guardarAlt(menos, '-1', siguiente));
                };
                siguiente();

            } else {
                // ── Guardar respuestas normales ────────────────────────────────
                const entries = Object.entries(respuestas || {});
                if (entries.length === 0) {
                    if (finalizar) return finalizarEval();
                    return res.json({ ok: true, mensaje: 'Avance guardado.' });
                }

                const altIds = Object.values(respuestas).map(Number);
                conn.query(
                    `SELECT id, score FROM alternativas WHERE id IN (${altIds.map(() => '?').join(',')})`,
                    altIds,
                    (err, altsData) => {
                        if (err) return res.status(500).json({ ok: false, mensaje: err.message });

                        const altMap = {};
                        altsData.forEach(a => altMap[a.id] = a.score);

                        let idx = 0;
                        const siguiente = () => {
                            if (idx >= entries.length) {
                                if (finalizar) return calcularResultados(ev.evaluacion_id, id, respuestaId, altIds, altsData, res);
                                return res.json({ ok: true, mensaje: 'Avance guardado.' });
                            }
                            const [pregId, altId] = entries[idx++];
                            const score = altMap[altId] ?? 0;

                            conn.query(
                                'SELECT id FROM detalle_respuesta WHERE respuesta_id = ? AND pregunta_id = ? LIMIT 1',
                                [respuestaId, pregId],
                                (err, rows) => {
                                    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
                                    if (rows.length > 0) {
                                        conn.query(
                                            'UPDATE detalle_respuesta SET alternativa_id=?, resultado=? WHERE id=?',
                                            [altId, score, rows[0].id], siguiente
                                        );
                                    } else {
                                        conn.query(
                                            'INSERT INTO detalle_respuesta (respuesta_id, alternativa_id, pregunta_id, resultado, estado_id) VALUES (?,?,?,?,1)',
                                            [respuestaId, altId, pregId, score], siguiente
                                        );
                                    }
                                }
                            );
                        };
                        siguiente();
                    }
                );
            }

            const finalizarEval = () => {
                conn.query(
                    `UPDATE evaluacion_usuario SET estado_id = 4, finalizacion = NOW() WHERE id = ?`,
                    [id], (err) => {
                        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
                        res.json({ ok: true, mensaje: 'Evaluación finalizada correctamente.' });
                    }
                );
            };
        });
    });
});

// ── POST /api/mis-evaluaciones/:id/guardar ────────────────────────────────────
app.post('/api/mis-evaluaciones/:id/guardar', verificarToken, (req, res) => {
    const { id } = req.params;
    const { respuestas, finalizar } = req.body;
    const nuevoEstado = finalizar ? 4 : 3;

    conn.query(
        'SELECT eu.*, e.id as eval_id FROM evaluacion_usuario eu INNER JOIN evaluacion e ON e.id = eu.evaluacion_id WHERE eu.id = ? AND eu.usuario_id = ?',
        [id, req.usuario.id],
        (err, rows) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });
            if (rows.length === 0) return res.status(403).json({ ok: false, mensaje: 'Sin acceso.' });

            const eu = rows[0];
            const idTest = eu.eval_id;

            const sqlUpd = finalizar
                ? 'UPDATE evaluacion_usuario SET estado_id=?, inicio=COALESCE(inicio, NOW()), finalizacion=NOW() WHERE id=?'
                : 'UPDATE evaluacion_usuario SET estado_id=?, inicio=COALESCE(inicio, NOW()) WHERE id=?';

            conn.query(sqlUpd, [nuevoEstado, id], (err2) => {
                if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });

                if (!respuestas || Object.keys(respuestas).length === 0) {
                    return res.json({ ok: true, mensaje: finalizar ? 'Evaluación finalizada.' : 'Avance guardado.' });
                }

                conn.query(
                    `DELETE dr FROM detalle_respuesta dr
                     INNER JOIN respuestas r ON r.id = dr.respuesta_id
                     WHERE r.evaluacion_usuario_id = ?`,
                    [id],
                    (err3) => {
                        if (err3) return res.status(500).json({ ok: false, mensaje: err3.message });

                        conn.query('DELETE FROM respuestas WHERE evaluacion_usuario_id = ?', [id], (err4) => {
                            if (err4) return res.status(500).json({ ok: false, mensaje: err4.message });

                            conn.query(
                                'INSERT INTO respuestas (evaluacion_usuario_id, estado_id, fecha, nro_intentos) VALUES (?, 1, NOW(), 1)',
                                [id],
                                (err5, result) => {
                                    if (err5) return res.status(500).json({ ok: false, mensaje: err5.message });

                                    const respuestaId = result.insertId;
                                    const entries = Object.entries(respuestas);

                                    if (entries.length === 0) return res.json({ ok: true });

                                    const altIds = entries.map(([, altId]) => altId);

                                    conn.query(
                                        'SELECT id, score, cuadrante, grupo, letra FROM alternativas WHERE id IN (?)',
                                        [altIds],
                                        (err6, altsData) => {
                                            if (err6) return res.status(500).json({ ok: false, mensaje: err6.message });

                                            const detalles = entries.map(([pregId, altId]) => {
                                                const alt = altsData.find(a => a.id == altId);
                                                return [respuestaId, altId, pregId, alt ? alt.score : 0, 1];
                                            });

                                            conn.query(
                                                'INSERT INTO detalle_respuesta (respuesta_id, alternativa_id, pregunta_id, resultado, estado_id) VALUES ?',
                                                [detalles],
                                                (err7) => {
                                                    if (err7) {
                                                        console.error('Error INSERT detalle_respuesta:', err7.message);
                                                        return res.status(500).json({ ok: false, mensaje: err7.message });
                                                    }

                                                    if (!finalizar) {
                                                        return res.json({ ok: true, mensaje: 'Avance guardado.' });
                                                    }

                                                    calcularResultados(idTest, id, respuestaId, altIds, altsData, res);
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        });
                    }
                );
            });
        }
    );
});

function calcularResultados(idTest, euId, respuestaId, altIds, altsData, res) {

    const guardarResultados = (jsonResultados) => {
        conn.query(
            'UPDATE evaluacion_usuario SET resultados=? WHERE id=?',
            [JSON.stringify(jsonResultados), euId],
            (err) => {
                if (err) return res.status(500).json({ ok: false, mensaje: err.message });
                res.json({ ok: true, mensaje: 'Evaluación finalizada correctamente.' });
            }
        );
    };

    // IDs 2, 5: Tests globales con tabla resultados
    if ([2, 5].includes(idTest)) {
        const puntajeTotal = altsData.reduce((sum, a) => sum + (a.score || 0), 0);
        const puntajeFinal = idTest === 5
            ? Math.round(puntajeTotal / (altIds.length || 1) * 100) / 100
            : puntajeTotal;

        conn.query(
            'SELECT * FROM resultados WHERE evaluacion_id=? AND minimo<=? AND maximo>=? LIMIT 1',
            [idTest, puntajeFinal, puntajeFinal],
            (err, diag) => {
                if (err) return res.status(500).json({ ok: false, mensaje: err.message });
                const d = diag[0];
                guardarResultados({ Resultados: [{ Puntaje: puntajeFinal, Resultado: d ? d.resultado : 'Sin diagnóstico', ResultadoDescripcion: d ? d.recomendaciones : '', dimension: null }] });
            }
        );

    // ID 8: Gestión del tiempo
    } else if (idTest === 8) {
        const puntajeTotal = altsData.reduce((sum, a) => sum + (a.score || 0), 0);
        const bgt = Math.round(puntajeTotal * 8.3333 * 100) / 100;
        const mgt = Math.round((12 - puntajeTotal) * 8.3333 * 100) / 100;
        guardarResultados({ Resultados: [
            { Puntaje: bgt, Resultado: bgt + '%', ResultadoDescripcion: 'Buena gestión del tiempo', dimension: null },
            { Puntaje: mgt, Resultado: mgt + '%', ResultadoDescripcion: 'Mala gestión del tiempo', dimension: null }
        ]});

    // IDs 3, 4, 9: Tests por dimensiones
    } else if ([3, 4, 9].includes(idTest)) {
        conn.query(
            `SELECT p.dimension_id as dimId, SUM(dr.resultado) as sumaTotal, COUNT(dr.resultado) as conteo
             FROM detalle_respuesta dr
             INNER JOIN preguntas p ON p.id = dr.pregunta_id
             WHERE dr.respuesta_id = ?
             GROUP BY p.dimension_id`,
            [respuestaId],
            (err, dims) => {
                if (err) return res.status(500).json({ ok: false, mensaje: err.message });

                const dimIds = dims.map(d => d.dimId);
                if (dimIds.length === 0) return guardarResultados({ Resultados: [] });

                conn.query('SELECT * FROM dimension WHERE id IN (?)', [dimIds], (err2, dimensiones) => {
                    if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });

                    const resultadosArray = [];
                    let pendientes = dims.length;

                    dims.forEach(row => {
                        const puntaje = idTest === 9
                            ? Math.round(row.sumaTotal / row.conteo * 100) / 100
                            : row.sumaTotal;

                        const dimObj = dimensiones.find(d => d.id === row.dimId);
                        const nombreDim = dimObj ? dimObj.dimension : 'Dimensión';
                        const descDim = idTest === 3
                            ? (dimObj ? dimObj.descripcion_larga : '')
                            : (dimObj ? dimObj.descripcion : '');

                        const qDiag = idTest === 3
                            ? 'SELECT * FROM resultados WHERE evaluacion_id=? AND minimo<=? AND maximo>=? LIMIT 1'
                            : 'SELECT * FROM resultados WHERE evaluacion_id=? AND dimension_id=? AND minimo<=? AND maximo>=? LIMIT 1';
                        const paramsDiag = idTest === 3
                            ? [idTest, puntaje, puntaje]
                            : [idTest, row.dimId, puntaje, puntaje];

                        conn.query(qDiag, paramsDiag, (err3, diag) => {
                            const d = diag ? diag[0] : null;
                            resultadosArray.push({
                                Puntaje: puntaje,
                                Resultado: d ? d.resultado : 'Sin diagnóstico',
                                ResultadoDescripcion: d ? d.recomendaciones : '',
                                dimension: nombreDim,
                                dimension_descripcion: descDim
                            });
                            if (--pendientes === 0) guardarResultados({ Resultados: resultadosArray });
                        });
                    });
                });
            }
        );

    // ID 1: Liderazgo Situacional
    } else if (idTest === 1) {
        const cuadranteCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
        let nivelM = 0;
        altsData.forEach(a => {
            if (a.cuadrante && cuadranteCounts[a.cuadrante] !== undefined) cuadranteCounts[a.cuadrante]++;
            nivelM += (a.score || 0);
        });
        const total = altIds.length || 1;

        conn.query(
            'SELECT * FROM resultados WHERE evaluacion_id=? AND minimo<=? AND maximo>=? LIMIT 1',
            [idTest, nivelM, nivelM],
            (err, diag) => {
                const d = diag ? diag[0] : null;
                guardarResultados({ Resultados: [
                    { dimension: 'ATBR', Puntaje: cuadranteCounts[1], Porcentaje: Math.round(cuadranteCounts[1]/total*100*100)/100, Resultado: 'E1: Dirigir', ResultadoDescripcion: 'Alto Comportamiento Directivo / Bajo Comportamiento de Apoyo' },
                    { dimension: 'ATAR', Puntaje: cuadranteCounts[2], Porcentaje: Math.round(cuadranteCounts[2]/total*100*100)/100, Resultado: 'E2: Persuadir', ResultadoDescripcion: 'Alto Comportamiento Directivo / Alto Comportamiento de Apoyo' },
                    { dimension: 'BTAR', Puntaje: cuadranteCounts[3], Porcentaje: Math.round(cuadranteCounts[3]/total*100*100)/100, Resultado: 'E3: Apoyar', ResultadoDescripcion: 'Alto Comportamiento de Apoyo / Bajo Comportamiento Directivo' },
                    { dimension: 'BTBR', Puntaje: cuadranteCounts[4], Porcentaje: Math.round(cuadranteCounts[4]/total*100*100)/100, Resultado: 'E4: Delegar', ResultadoDescripcion: 'Bajo Comportamiento de Apoyo / Bajo Comportamiento Directivo' },
                    { dimension: 'Nivel de Efectividad', Puntaje: nivelM, Porcentaje: 0, Resultado: d ? d.resultado : 'Nivel ' + nivelM, ResultadoDescripcion: d ? d.recomendaciones : '' }
                ]});
            }
        );

    // ID 6: Manejo de Conflictos
    } else if (idTest === 6) {
        const mapeoCuadrantes = { 1: 13, 2: 14, 3: 15, 4: 16, 5: 17 };
        const cuadranteCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        altsData.forEach(a => { if (a.cuadrante && cuadranteCounts[a.cuadrante] !== undefined) cuadranteCounts[a.cuadrante]++; });

        const dimIds = Object.values(mapeoCuadrantes);
        conn.query('SELECT * FROM dimension WHERE id IN (?)', [dimIds], (err, dims) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });

            const resultadosArray = [];
            let pendientes = Object.keys(mapeoCuadrantes).length;

            Object.entries(mapeoCuadrantes).forEach(([cuadrante, dimId]) => {
                const puntaje = cuadranteCounts[cuadrante] || 0;
                conn.query(
                    'SELECT * FROM resultados WHERE evaluacion_id=? AND dimension_id=? AND minimo<=? AND maximo>=? LIMIT 1',
                    [idTest, dimId, puntaje, puntaje],
                    (err2, diag) => {
                        const d = diag ? diag[0] : null;
                        const dimObj = dims.find(x => x.id == dimId);
                        if (d) {
                            resultadosArray.push({
                                Puntaje: puntaje,
                                Resultado: (dimObj ? dimObj.dimension : '') + ' ' + (d ? d.resultado : ''),
                                ResultadoDescripcion: d ? d.recomendaciones : '',
                                dimension: dimObj ? dimObj.dimension : '',
                                dimension_descripcion: dimObj ? dimObj.descripcion : ''
                            });
                        }
                        if (--pendientes === 0) guardarResultados({ Resultados: resultadosArray });
                    }
                );
            });
        });

    // ID 7: Estilos de Aprendizaje
    } else if (idTest === 7) {
        conn.query(
            `SELECT a.cuadrante, SUM(dr.resultado) as total
             FROM detalle_respuesta dr
             INNER JOIN alternativas a ON a.id = dr.alternativa_id
             WHERE dr.respuesta_id = ?
             GROUP BY a.cuadrante`,
            [respuestaId],
            (err, cuads) => {
                if (err) return res.status(500).json({ ok: false, mensaje: err.message });

                const get = (c) => { const r = cuads.find(x => x.cuadrante == c); return r ? r.total : 0; };
                const iEC = get(18), iOR = get(19), iCA = get(20), iEA = get(21);
                const val_CA_EC = iCA - iEC;
                const val_EA_OR = iEA - iOR;

                let nombreCuadrante = '';
                if (val_CA_EC > 0 && val_EA_OR > 0) nombreCuadrante = 'Divergente';
                else if (val_CA_EC < 0 && val_EA_OR < 0) nombreCuadrante = 'Convergente';
                else if (val_CA_EC > 0 && val_EA_OR < 0) nombreCuadrante = 'Acomodador';
                else if (val_CA_EC < 0 && val_EA_OR > 0) nombreCuadrante = 'Asimilador';

                const dimIds = [18, 19, 20, 21];
                conn.query('SELECT * FROM dimension WHERE id IN (?)', [dimIds], (err2, dims) => {
                    conn.query(
                        'SELECT * FROM resultados WHERE evaluacion_id=? AND resultado=? LIMIT 1',
                        [idTest, nombreCuadrante],
                        (err3, diagCuad) => {
                            const getDim = (id) => dims.find(d => d.id == id);
                            const dC = diagCuad ? diagCuad[0] : null;
                            guardarResultados({ Resultados: [
                                { Puntaje: iEC, Resultado: getDim(18)?.dimension || '', ResultadoDescripcion: '', dimension: getDim(18)?.dimension || '', dimension_descripcion: getDim(18)?.descripcion || '' },
                                { Puntaje: iOR, Resultado: getDim(19)?.dimension || '', ResultadoDescripcion: '', dimension: getDim(19)?.dimension || '', dimension_descripcion: getDim(19)?.descripcion || '' },
                                { Puntaje: iCA, Resultado: getDim(20)?.dimension || '', ResultadoDescripcion: '', dimension: getDim(20)?.dimension || '', dimension_descripcion: getDim(20)?.descripcion || '' },
                                { Puntaje: iEA, Resultado: getDim(21)?.dimension || '', ResultadoDescripcion: '', dimension: getDim(21)?.dimension || '', dimension_descripcion: getDim(21)?.descripcion || '' },
                                { Puntaje: val_EA_OR, Resultado: val_EA_OR > 0 ? 'Reflexivo' : 'Activo', ResultadoDescripcion: 'EA-OR eje abscisas', dimension: 'EJE HORIZONTAL', dimension_descripcion: 'Tendencia Reflexiva vs Activa' },
                                { Puntaje: val_CA_EC, Resultado: val_CA_EC > 0 ? 'Concreto' : 'Abstracto', ResultadoDescripcion: 'CA-EC eje ordenadas', dimension: 'EJE VERTICAL', dimension_descripcion: 'Tendencia Concreta vs Abstracta' },
                                { Puntaje: 0, Resultado: 'Cuadrante ' + nombreCuadrante, ResultadoDescripcion: dC ? dC.recomendaciones : '', dimension: 'ESTILO DE APRENDIZAJE', dimension_descripcion: 'Perfil dominante según matriz de Kolb' }
                            ]});
                        }
                    );
                });
            }
        );

    // Default: puntaje simple
    } else {
        const puntajeTotal = altsData.reduce((sum, a) => sum + (a.score || 0), 0);
        guardarResultados({ Resultados: [{ Puntaje: puntajeTotal, Resultado: 'Test completado', ResultadoDescripcion: '', dimension: null }] });
    }
}

// ── GET /api/mis-evaluaciones/:id/resultados ──────────────────────────────────
app.get('/api/mis-evaluaciones/:id/resultados', verificarToken, (req, res) => {
    const { id } = req.params;

    const sql = `SELECT eu.id, eu.resultados, eu.finalizacion, eu.estado_id,
                        e.id as evaluacion_id, e.nombre, e.descripcion,
                        e.interpretacion, e.foto
                 FROM evaluacion_usuario eu
                 INNER JOIN evaluacion e ON e.id = eu.evaluacion_id
                 WHERE eu.id = ? AND eu.usuario_id = ?`;

    conn.query(sql, [id, req.usuario.id], (err, rows) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });
        if (rows.length === 0) return res.status(403).json({ ok: false, mensaje: 'Sin acceso.' });

        const eu = rows[0];
        const resultadosJson = eu.resultados ? JSON.parse(eu.resultados) : { Resultados: [] };

        console.log('Resultados JSON:', JSON.stringify(resultadosJson));
        res.json({ ok: true, data: { ...eu, resultadosJson } });
    });
});

// ── GET /api/evaluaciones/asignadas/:usuarioId ────────────────────────────────
app.get('/api/evaluaciones/asignadas/:usuarioId', verificarToken, (req, res) => {
    const { usuarioId } = req.params;
    conn.query(
        'SELECT evaluacion_id FROM evaluacion_usuario WHERE usuario_id = ? AND estado_id = 1',
        [usuarioId],
        (err, results) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });
            res.json({ ok: true, data: results.map(r => r.evaluacion_id) });
        }
    );
});

// ── POST /api/evaluaciones/asignar-lote ───────────────────────────────────────
app.post('/api/evaluaciones/asignar-lote', verificarToken, (req, res) => {
    const { usuario_id, evaluaciones, intentos, ver_resultados } = req.body;
    if (!usuario_id) return res.status(400).json({ ok: false, mensaje: 'usuario_id requerido.' });

    // Desactivar asignaciones actuales
    conn.query('UPDATE evaluacion_usuario SET estado_id = 2 WHERE usuario_id = ? AND estado_id = 1', [usuario_id], (err) => {
        if (err) return res.status(500).json({ ok: false, mensaje: err.message });

        if (!evaluaciones || evaluaciones.length === 0) {
            return res.json({ ok: true, mensaje: 'Asignaciones actualizadas.' });
        }

        let procesados = 0;
        evaluaciones.forEach(evalId => {
            conn.query(
                'SELECT id FROM evaluacion_usuario WHERE usuario_id = ? AND evaluacion_id = ?',
                [usuario_id, evalId],
                (err2, existe) => {
                    if (existe && existe.length > 0) {
                        conn.query(
                            'UPDATE evaluacion_usuario SET estado_id=1, fecha=NOW() WHERE usuario_id=? AND evaluacion_id=?',
                            [usuario_id, evalId],
                            () => { procesados++; if (procesados === evaluaciones.length) res.json({ ok: true, mensaje: 'Asignaciones guardadas.' }); }
                        );
                    } else {
                        conn.query(
                            'INSERT INTO evaluacion_usuario (usuario_id, evaluacion_id, intentos, ver_resultados, estado_id, fecha) VALUES (?,?,?,?,1,NOW())',
                            [usuario_id, evalId, intentos || 1, ver_resultados || 0],
                            () => { procesados++; if (procesados === evaluaciones.length) res.json({ ok: true, mensaje: 'Asignaciones guardadas.' }); }
                        );
                    }
                }
            );
        });
    });
});

// ── INSTITUCIONES ─────────────────────────────────────────────────────────────

app.get('/api/instituciones', verificarToken, (req, res) => {
    const estadoId = req.query.estado || 1;
    const sql = `
        SELECT em.id, em.empresa, em.razonsocial, em.numero_identificacion_fiscal,
               em.direccion, em.telefonos, em.pagina_web, em.estado_id,
               es.nombre as estado
        FROM empresa em
        LEFT JOIN estado es ON es.id = em.estado_id
        WHERE em.estado_id = ?
        ORDER BY em.id DESC`;
    conn.query(sql, [estadoId], (err, rows) => {
        if (err) return res.status(500).json({ ok: false });
        res.json({ ok: true, data: rows });
    });
});

app.post('/api/instituciones', verificarToken, (req, res) => {
    const { empresa, razonsocial, numero_identificacion_fiscal, direccion, telefonos, pagina_web } = req.body;
    if (!empresa) return res.status(400).json({ ok: false, mensaje: 'El nombre es obligatorio.' });
    const sql = `INSERT INTO empresa (empresa, razonsocial, numero_identificacion_fiscal, direccion, telefonos, pagina_web, estado_id, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`;
    conn.query(sql, [empresa, razonsocial, numero_identificacion_fiscal, direccion, telefonos, pagina_web], (err, result) => {
        if (err) return res.status(500).json({ ok: false, mensaje: 'Error al crear.' });
        res.json({ ok: true, id: result.insertId });
    });
});

app.put('/api/instituciones/:id', verificarToken, (req, res) => {
    const { empresa, razonsocial, numero_identificacion_fiscal, direccion, telefonos, pagina_web } = req.body;
    if (!empresa) return res.status(400).json({ ok: false, mensaje: 'El nombre es obligatorio.' });
    const sql = `UPDATE empresa SET empresa=?, razonsocial=?, numero_identificacion_fiscal=?, direccion=?, telefonos=?, pagina_web=?, updated_at=NOW() WHERE id=?`;
    conn.query(sql, [empresa, razonsocial, numero_identificacion_fiscal, direccion, telefonos, pagina_web, req.params.id], (err) => {
        if (err) return res.status(500).json({ ok: false });
        res.json({ ok: true });
    });
});

app.post('/api/instituciones/:id/desactivar', verificarToken, (req, res) => {
    conn.query('UPDATE empresa SET estado_id=2, updated_at=NOW() WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ ok: false });
        res.json({ ok: true });
    });
});

app.post('/api/instituciones/:id/activar', verificarToken, (req, res) => {
    conn.query('UPDATE empresa SET estado_id=1, updated_at=NOW() WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ ok: false });
        res.json({ ok: true });
    });
});

app.post('/api/instituciones/carga-masiva', verificarToken, upload.single('archivo'), (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, mensaje: 'No se recibió archivo.' });
    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true, raw: false, dense: false });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];
        const rows     = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (rows.length === 0) return res.status(400).json({ ok: false, mensaje: 'El archivo está vacío.' });

        let created = 0, updated = 0, skipped = 0;
        let pending = rows.length;

        const done = () => {
            if (--pending === 0)
                res.json({ ok: true, created, updated, skipped });
        };

        rows.forEach(row => {
            const empresa = (row['empresa'] || row['Empresa'] || '').toString().trim();
            if (!empresa) { skipped++; done(); return; }

            const payload = {
                empresa,
                razonsocial:                  (row['razonsocial']    || row['Razón Social']       || '').toString().trim(),
                numero_identificacion_fiscal: (row['nroidentfiscal'] || row['N° Ident. Fiscal']   || '').toString().trim(),
                direccion:                    (row['direccion']      || row['Dirección']           || '').toString().trim(),
                telefonos:                    (row['telefonos']      || row['Teléfonos']           || '').toString().trim(),
                pagina_web:                   (row['paginaweb']      || row['Página Web']          || '').toString().trim(),
            };

            const sqlBuscar = 'SELECT id FROM empresa WHERE LOWER(empresa) = LOWER(?) LIMIT 1';
            conn.query(sqlBuscar, [empresa], (err, found) => {
                if (err) { skipped++; done(); return; }
                if (found.length > 0) {
                    const sqlUpd = 'UPDATE empresa SET razonsocial=?, numero_identificacion_fiscal=?, direccion=?, telefonos=?, pagina_web=?, updated_at=NOW() WHERE id=?';
                    conn.query(sqlUpd, [payload.razonsocial, payload.numero_identificacion_fiscal, payload.direccion, payload.telefonos, payload.pagina_web, found[0].id], () => { updated++; done(); });
                } else {
                    const sqlIns = 'INSERT INTO empresa (empresa, razonsocial, numero_identificacion_fiscal, direccion, telefonos, pagina_web, estado_id, created_at, updated_at) VALUES (?,?,?,?,?,?,1,NOW(),NOW())';
                    conn.query(sqlIns, [payload.empresa, payload.razonsocial, payload.numero_identificacion_fiscal, payload.direccion, payload.telefonos, payload.pagina_web], () => { created++; done(); });
                }
            });
        });
    } catch (e) {
        res.status(500).json({ ok: false, mensaje: 'Error al procesar el archivo.' });
    }
});

// ── GET /api/dashboard ────────────────────────────────────────────────────────
app.get('/api/dashboard', verificarToken, (req, res) => {
  let completadas = 0;
  const resultado = {};
  const total = 5;
  const check = () => { if (++completadas === total) res.json({ ok: true, data: resultado }); };

  // Total clientes activos
  conn.query(
    `SELECT COUNT(*) as total FROM user WHERE rolusuario_id = 3 AND estado_id = 1`,
    (err, r) => { resultado.clientes_total = err ? 0 : r[0].total; check(); }
  );

  // Clientes con al menos una sesión pendiente (estado 1) → por asesorar
  conn.query(
    `SELECT COUNT(DISTINCT usuario_id) as total FROM sesion WHERE estado_id = 1`,
    (err, r) => { resultado.clientes_por_asesorar = err ? 0 : r[0].total; check(); }
  );

  // Clientes con al menos una sesión finalizada (estado 4) → ya asesorados
  conn.query(
    `SELECT COUNT(DISTINCT usuario_id) as total FROM sesion WHERE estado_id = 4`,
    (err, r) => { resultado.clientes_asesorados = err ? 0 : r[0].total; check(); }
  );

  // Evaluaciones pendientes o en proceso (estado 1 o 3)
  conn.query(
    `SELECT COUNT(*) as total FROM evaluacion_usuario WHERE estado_id IN (1, 3)`,
    (err, r) => { resultado.evaluaciones_pendientes = err ? 0 : r[0].total; check(); }
  );

  // Evaluaciones finalizadas (estado 4)
  conn.query(
    `SELECT COUNT(*) as total FROM evaluacion_usuario WHERE estado_id = 4`,
    (err, r) => { resultado.evaluaciones_finalizadas = err ? 0 : r[0].total; check(); }
  );
});

// Servir archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── GET /api/categorias ───────────────────────────────────────────────────────
app.get('/api/categorias', verificarToken, (req, res) => {
  conn.query('SELECT id, nombre FROM categorias ORDER BY nombre', (err, rows) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.json({ ok: true, data: rows });
  });
});

// ── GET /api/biblioteca?tipo=digital|audiovisual&estado=1|2 ───────────────────
app.get('/api/biblioteca', verificarToken, (req, res) => {
  const tipo   = req.query.tipo   || 'digital';
  const estado = req.query.estado || 1;
  const sql = `SELECT b.id, b.titulo, b.descripcion, b.tipo,
                      b.ruta_archivo, b.url, b.estado_id, b.usuario_id,
                      c.nombre as categoria, c.id as categoria_id,
                      u.nombre as usuario,
                      e.nombre as estado
               FROM biblioteca b
               LEFT JOIN categorias c ON c.id = b.categoria_id
               LEFT JOIN user u       ON u.id = b.usuario_id
               LEFT JOIN estado e     ON e.id = b.estado_id
               WHERE b.tipo = ? AND b.estado_id = ?
               ORDER BY b.id DESC`;
  conn.query(sql, [tipo, estado], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.json({ ok: true, data: rows });
  });
});

// ── POST /api/biblioteca/digital ─────────────────────────────────────────────
app.post('/api/biblioteca/digital', verificarToken, upload.single('archivo'), (req, res) => {
  const { titulo, descripcion, categoria_id } = req.body;
  if (!titulo || !categoria_id || !req.file) {
    return res.status(400).json({ ok: false, mensaje: 'Título, categoría y archivo son requeridos.' });
  }

  const uploadDir = path.join(__dirname, 'uploads', 'biblioteca');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const ext      = path.extname(req.file.originalname) || '.pdf';
  const filename = `doc_${Date.now()}${ext}`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, req.file.buffer);

  const ruta_archivo = `biblioteca/${filename}`;
  const sql = `INSERT INTO biblioteca (titulo, descripcion, tipo, ruta_archivo, url, categoria_id, estado_id, usuario_id, created_at, updated_at)
               VALUES (?, ?, 'digital', ?, NULL, ?, 1, ?, NOW(), NOW())`;
  conn.query(sql, [titulo, descripcion || null, ruta_archivo, categoria_id, req.usuario.id], (err, result) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.status(201).json({ ok: true, mensaje: 'Documento agregado correctamente.', id: result.insertId });
  });
});

// ── PUT /api/biblioteca/digital/:id ──────────────────────────────────────────
app.put('/api/biblioteca/digital/:id', verificarToken, upload.single('archivo'), (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, categoria_id } = req.body;
  if (!titulo || !categoria_id) {
    return res.status(400).json({ ok: false, mensaje: 'Título y categoría son requeridos.' });
  }

  const actualizar = (ruta_archivo) => {
    let sql, params;
    if (ruta_archivo) {
      sql    = `UPDATE biblioteca SET titulo=?, descripcion=?, categoria_id=?, ruta_archivo=?, updated_at=NOW() WHERE id=? AND tipo='digital'`;
      params = [titulo, descripcion || null, categoria_id, ruta_archivo, id];
    } else {
      sql    = `UPDATE biblioteca SET titulo=?, descripcion=?, categoria_id=?, updated_at=NOW() WHERE id=? AND tipo='digital'`;
      params = [titulo, descripcion || null, categoria_id, id];
    }
    conn.query(sql, params, (err) => {
      if (err) return res.status(500).json({ ok: false, mensaje: err.message });
      res.json({ ok: true, mensaje: 'Documento actualizado correctamente.' });
    });
  };

  if (req.file) {
    const uploadDir = path.join(__dirname, 'uploads', 'biblioteca');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const ext      = path.extname(req.file.originalname) || '.pdf';
    const filename = `doc_${Date.now()}${ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
    actualizar(`biblioteca/${filename}`);
  } else {
    actualizar(null);
  }
});

// ── POST /api/biblioteca/audiovisual ─────────────────────────────────────────
app.post('/api/biblioteca/audiovisual', verificarToken, (req, res) => {
  const { titulo, descripcion, url, categoria_id } = req.body;
  if (!titulo || !url || !categoria_id) {
    return res.status(400).json({ ok: false, mensaje: 'Título, URL y categoría son requeridos.' });
  }
  const sql = `INSERT INTO biblioteca (titulo, descripcion, tipo, ruta_archivo, url, categoria_id, estado_id, usuario_id, created_at, updated_at)
               VALUES (?, ?, 'audiovisual', NULL, ?, ?, 1, ?, NOW(), NOW())`;
  conn.query(sql, [titulo, descripcion || null, url, categoria_id, req.usuario.id], (err, result) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.status(201).json({ ok: true, mensaje: 'Video agregado correctamente.', id: result.insertId });
  });
});

// ── PUT /api/biblioteca/audiovisual/:id ───────────────────────────────────────
app.put('/api/biblioteca/audiovisual/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, url, categoria_id } = req.body;
  if (!titulo || !url || !categoria_id) {
    return res.status(400).json({ ok: false, mensaje: 'Título, URL y categoría son requeridos.' });
  }
  const sql = `UPDATE biblioteca SET titulo=?, descripcion=?, url=?, categoria_id=?, updated_at=NOW() WHERE id=? AND tipo='audiovisual'`;
  conn.query(sql, [titulo, descripcion || null, url, categoria_id, id], (err) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.json({ ok: true, mensaje: 'Video actualizado correctamente.' });
  });
});

// ── POST /api/biblioteca/:id/desactivar ───────────────────────────────────────
app.post('/api/biblioteca/:id/desactivar', verificarToken, (req, res) => {
  conn.query('UPDATE biblioteca SET estado_id = 2 WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.json({ ok: true, mensaje: 'Registro desactivado.' });
  });
});

// ── POST /api/biblioteca/:id/activar ─────────────────────────────────────────
app.post('/api/biblioteca/:id/activar', verificarToken, (req, res) => {
  conn.query('UPDATE biblioteca SET estado_id = 1 WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.json({ ok: true, mensaje: 'Registro activado.' });
  });
});

// ── GET /api/mi-biblioteca ────────────────────────────────────────────────────
app.get('/api/mi-biblioteca', verificarToken, (req, res) => {
  const sql = `SELECT b.id, b.titulo, b.descripcion, b.tipo,
                      b.ruta_archivo, b.url,
                      c.nombre as categoria
               FROM biblioteca b
               LEFT JOIN categorias c ON c.id = b.categoria_id
               WHERE b.usuario_id = ? AND b.estado_id = 1
               ORDER BY b.tipo, b.id DESC`;
  conn.query(sql, [req.usuario.id], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    res.json({ ok: true, data: rows });
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend EvalCoach escuchando en puerto ${PORT}`);
});