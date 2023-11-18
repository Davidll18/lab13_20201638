const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bicicentro',
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

// Ruta para obtener la lista de trabajadores
app.get('/trabajadores', (req, res) => {
    const query = 'SELECT * FROM trabajadores';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener la lista de trabajadores:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            res.json(results);
        }
    });
});

// Ruta para obtener la lista de sedes
app.get('/sedes', (req, res) => {
    const query = 'SELECT * FROM sedes';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener la lista de sedes:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            res.json(results);
        }
    });
});

// Ruta para obtener un trabajador por su DNI con el nombre de la sede
app.get('/trabajadores/:dni', (req, res) => {
    const dni = req.params.dni;
    const query = `
    SELECT trabajadores.*, sedes.nombreSede
    FROM trabajadores
    JOIN sedes ON trabajadores.idsede = sedes.idsede
    WHERE trabajadores.dni = ?`;

    db.query(query, [dni], (error, results) => {
        if (error) {
            console.error('Error al obtener el trabajador:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            if (results.length === 0) {
                res.status(404).send('Trabajador no encontrado');
            } else {
                res.json(results[0]);
            }
        }
    });
});
app.get('/trabajadores/ventas/:dni', (req, res) => {
    const dni = req.params.dni;
    const query = `
    SELECT ventas.*, inventario.nombre AS nombreProducto
    FROM ventas
    JOIN trabajadores ON ventas.dniTrabajador = trabajadores.dni
    JOIN inventario ON ventas.id_inventario = inventario.idinventario
    WHERE trabajadores.dni = ?
  `;

    db.query(query, [dni], (error, results) => {
        if (error) {
            console.error('Error al obtener las ventas del trabajador:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            if (results.length === 0) {
                res.status(404).send('No se encontraron ventas para este trabajador');
            } else {
                res.json(results);
            }
        }
    });
});
app.get('/sedes', (req, res) => {
    const query = 'SELECT * FROM sedes';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener la lista de sedes:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            res.json(results);
        }
    });
});

// Ruta para obtener la información de una sede por su idsede
app.get('/sedes/:idsede', (req, res) => {
    const idsede = req.params.idsede;
    const query = 'SELECT * FROM sedes WHERE idsede = ?';

    db.query(query, [idsede], (error, results) => {
        if (error) {
            console.error('Error al obtener la información de la sede:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            if (results.length === 0) {
                res.status(404).send('Sede no encontrada');
            } else {
                res.json(results[0]);
            }
        }
    });
});
// Ruta para obtener los trabajadores de una sede por su idsede
app.get('/sedes/trabajadores/:idsede', (req, res) => {
    const idsede = req.params.idsede;
    const query = `
    SELECT trabajadores.*
    FROM trabajadores
    WHERE trabajadores.idsede = ?
  `;

    db.query(query, [idsede], (error, results) => {
        if (error) {
            console.error('Error al obtener los trabajadores de la sede:', error);
            res.status(500).send('Error interno del servidor');
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
