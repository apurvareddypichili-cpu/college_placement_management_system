
const express = require('express');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Appu@2006!',
    database: 'college_placement_db'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log('Database Connection Failed:', err.message);
        return;
    }

    console.log('MySQL Database Connected Successfully!');
});

// ================= HOME PAGE =================

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// ================= STUDENT TABLE =================

// Display All Students
app.get('/students', (req, res) => {
    db.query('SELECT * FROM student', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Display One Student
app.get('/students/:id', (req, res) => {
    db.query(
        'SELECT * FROM student WHERE STUDENT_ID = ?',
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

// Insert Student
app.post('/students', (req, res) => {
    const {
        STUDENT_ID, NAME, DEPARTMENT,
        EMAIL, PHONE, CGPA
    } = req.body;

    const sql = `INSERT INTO student
    (STUDENT_ID, NAME, DEPARTMENT, EMAIL, PHONE, CGPA)
    VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        STUDENT_ID, NAME, DEPARTMENT,
        EMAIL, PHONE, CGPA
    ], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send('Student Inserted Successfully!');
    });
});

// Update Student
app.put('/students/:id', (req, res) => {
    const {
        NAME, DEPARTMENT, EMAIL, PHONE, CGPA
    } = req.body;

    const sql = `UPDATE student SET
    NAME = ?, DEPARTMENT = ?, EMAIL = ?,
    PHONE = ?, CGPA = ?
    WHERE STUDENT_ID = ?`;

    db.query(sql, [
        NAME, DEPARTMENT, EMAIL,
        PHONE, CGPA, req.params.id
    ], (err, result) => {
        if (err) return res.status(500).send(err.message);

        if (result.affectedRows === 0)
            return res.status(404).send('Student Not Found');

        res.send('Student Updated Successfully!');
    });
});

// Delete Student
app.delete('/students/:id', (req, res) => {
    db.query(
        'DELETE FROM student WHERE STUDENT_ID = ?',
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            if (result.affectedRows === 0)
                return res.status(404).send('Student Not Found');

            res.send('Student Deleted Successfully!');
        }
    );
});


// ================= COMPANIES TABLE =================

// Display All Companies
app.get('/companies', (req, res) => {
    db.query('SELECT * FROM companies', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Display One Company
app.get('/companies/:id', (req, res) => {
    db.query(
        'SELECT * FROM companies WHERE COMPANY_ID = ?',
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

// Insert Company
app.post('/companies', (req, res) => {
    const {
        COMPANY_ID, COMPANY_NAME, LOCATION,
        PACKAGE, ELIGIBILITY_CGPA, JOB_ROLE
    } = req.body;

    const sql = `INSERT INTO companies
    (COMPANY_ID, COMPANY_NAME, LOCATION, PACKAGE,
    ELIGIBILITY_CGPA, JOB_ROLE)
    VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        COMPANY_ID, COMPANY_NAME, LOCATION,
        PACKAGE, ELIGIBILITY_CGPA, JOB_ROLE
    ], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send('Company Inserted Successfully!');
    });
});

// Update Company
app.put('/companies/:id', (req, res) => {
    const {
        COMPANY_NAME, LOCATION, PACKAGE,
        ELIGIBILITY_CGPA, JOB_ROLE
    } = req.body;

    const sql = `UPDATE companies SET
    COMPANY_NAME = ?, LOCATION = ?, PACKAGE = ?,
    ELIGIBILITY_CGPA = ?, JOB_ROLE = ?
    WHERE COMPANY_ID = ?`;

    db.query(sql, [
        COMPANY_NAME, LOCATION, PACKAGE,
        ELIGIBILITY_CGPA, JOB_ROLE, req.params.id
    ], (err, result) => {
        if (err) return res.status(500).send(err.message);

        if (result.affectedRows === 0)
            return res.status(404).send('Company Not Found');

        res.send('Company Updated Successfully!');
    });
});

// Delete Company
app.delete('/companies/:id', (req, res) => {
    db.query(
        'DELETE FROM companies WHERE COMPANY_ID = ?',
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            if (result.affectedRows === 0)
                return res.status(404).send('Company Not Found');

            res.send('Company Deleted Successfully!');
        }
    );
});


// ================= APPLICATIONS TABLE =================

// Display All Applications
app.get('/applications', (req, res) => {
    const sql = `SELECT
        a.APPLICATION_ID,
        a.STUDENT_ID,
        s.NAME AS STUDENT_NAME,
        a.COMPANY_ID,
        c.COMPANY_NAME,
        a.APPLICATION_DATE,
        a.STATUS
        FROM applications a
        JOIN student s ON a.STUDENT_ID = s.STUDENT_ID
        JOIN companies c ON a.COMPANY_ID = c.COMPANY_ID`;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Display One Application
app.get('/applications/:id', (req, res) => {
    db.query(
        'SELECT * FROM applications WHERE APPLICATION_ID = ?',
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

// Insert Application
app.post('/applications', (req, res) => {
    const {
        APPLICATION_ID, STUDENT_ID, COMPANY_ID,
        APPLICATION_DATE, STATUS
    } = req.body;

    const sql = `INSERT INTO applications
    (APPLICATION_ID, STUDENT_ID, COMPANY_ID,
    APPLICATION_DATE, STATUS)
    VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [
        APPLICATION_ID, STUDENT_ID, COMPANY_ID,
        APPLICATION_DATE, STATUS
    ], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send('Application Inserted Successfully!');
    });
});

// Update Application
app.put('/applications/:id', (req, res) => {
    const {
        STUDENT_ID, COMPANY_ID,
        APPLICATION_DATE, STATUS
    } = req.body;

    const sql = `UPDATE applications SET
    STUDENT_ID = ?, COMPANY_ID = ?,
    APPLICATION_DATE = ?, STATUS = ?
    WHERE APPLICATION_ID = ?`;

    db.query(sql, [
        STUDENT_ID, COMPANY_ID,
        APPLICATION_DATE, STATUS, req.params.id
    ], (err, result) => {
        if (err) return res.status(500).send(err.message);

        if (result.affectedRows === 0)
            return res.status(404).send('Application Not Found');

        res.send('Application Updated Successfully!');
    });
});

// Delete Application
app.delete('/applications/:id', (req, res) => {
    db.query(
        'DELETE FROM applications WHERE APPLICATION_ID = ?',
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            if (result.affectedRows === 0)
                return res.status(404).send('Application Not Found');

            res.send('Application Deleted Successfully!');
        }
    );
});


// ================= START SERVER =================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
