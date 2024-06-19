const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminroot',
    database: 'ReportesServicios'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

app.post('/reportes', (req, res) => {
    const reporte = req.body.reporte;
    const detalles = req.body.detalles;
    const query = 'INSERT INTO Reportes SET ?';
    db.query(query, reporte, (err, result) => {
        if (err) throw err;
        const reporteId = result.insertId;
        detalles.forEach(detalle => {
            detalle.reporte_id = reporteId;
            const queryDetalle = 'INSERT INTO DetallesReporte SET ?';
            db.query(queryDetalle, detalle, (err, result) => {
                if (err) throw err;
            });
        });
        res.send('Reporte creado!');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
