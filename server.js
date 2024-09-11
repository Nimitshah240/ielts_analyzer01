// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '', // replace with your MySQL password
    database: 'ielts_analyser', // replace with your database name
    port: 3306 // default MySQL port
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});



// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.post('/logindata', (req, res) => {
    const receivedData = req.body;
    let query = 'SELECT * FROM user WHERE id = ' + receivedData.user_id;
    let res_len;

    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            res_len = results.length
        }
        if (res_len == 1) {
            query = 'UPDATE user SET ll_date = ? WHERE id = ?';
            connection.execute(query, [receivedData.ll_date, receivedData.user_id], (error, results, fields) => {
                if (error) {
                    console.error(error);
                } else {
                    res.json(receivedData);
                }
            });
        } else {
            query = 'INSERT INTO user (id, name, email,location, fl_date, ll_date, picture) VALUES (\'' + receivedData.user_id + '\',\'' + receivedData.name + '\',\'' + receivedData.email + '\',\'' + receivedData.location + '\', \'' + receivedData.fl_date + '\',\'' + receivedData.ll_date + '\',\'' + receivedData.picture + '\')';
            connection.execute(query, (error, results, fields) => {
                if (error) {
                    console.error(error);
                } else {
                    res.json(receivedData);
                }
            });
        }
    });
});

app.get('/api/examdata', (req, res) => {
    const user_id = req.query.user_id;
    const module = [];
    if (req.query.module == 'undefined') {
        module.push('\'Reading\'');
        module.push('\'Listening\'');
    } else {
        module.push('\'' + req.query.module + '\'');
    }

    let query = `SELECT exam.*, question.* FROM exam LEFT JOIN question ON question.exam_id = exam.id WHERE exam.user_id = ${user_id} AND module IN (${module.join(', ')})`;

    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            res.json(results);
        }
    });
});

app.delete('/api/deleteExam', (req, res) => {
    const exam_id = req.query.exam_id;
    let query = "DELETE FROM exam WHERE id = ?";

    connection.execute(query, [exam_id], (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            query = "DELETE FROM question WHERE exam_id = ?";
            connection.execute(query, [exam_id], (error, results, fields) => {
                if (error) {
                    console.error(error);
                } else {
                    res.json(results)
                }
            });
        }
    });
});

app.post('/api/insertExam', (req, res) => {

    let exam_id = req.headers.exam_id;
    const receivedData = req.body;
    let exam_query = `INSERT INTO exam (user_id, exam_name, date, module, band) VALUES (${receivedData[0].user_id}, '${receivedData[0].exam_name}', '${receivedData[0].date}', '${receivedData[0].module}', ${receivedData[0].band}) `;

    if (exam_id != '') {
        exam_query = `UPDATE exam SET exam_name = '${receivedData[0].exam_name}', date = '${receivedData[0].date}', band = ${receivedData[0].band} WHERE id = ${exam_id}`
        connection.execute(exam_query, (error, results) => {
            if (error) console.error(error);
            questioninsert(receivedData, exam_id);
        });
    } else {
        connection.execute(exam_query, (error, results) => {
            if (error) console.error(error);
            exam_id = results.insertId;
            questioninsert(receivedData, exam_id);
        });
    }
});

function questioninsert(receivedData, exam_id) {
    let query;
    let values = [];
    const queryBase = 'INSERT INTO question (user_id, exam_id, question_type, correct, incorrect, miss, total, section) VALUES ';

    receivedData.forEach(element => {
        if (element.id == "") {
            values.push(`(${element.user_id}, ${exam_id}, '${element.question_type}', ${element.correct}, ${element.incorrect}, ${element.miss}, ${element.total}, ${element.section})`);
        }
    });
    query = queryBase + values.join(', ');

    connection.execute(query, (error, results, fields) => {
        if (error) console.error(error);
    });
}

app.delete('/api/deleteQuestion', (req, res) => {
    const question_id = req.query.question_id;
    let query = "DELETE FROM question WHERE id = ?";

    connection.execute(query, [question_id], (error, results, fields) => {
        if (error) {
            console.error(error);
        }
    });
    res.json(question_id);
});

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
});
