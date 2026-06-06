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

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(3000, () => {
    console.log('Servidor backend EvalCoach escuchando en puerto 3000');
});