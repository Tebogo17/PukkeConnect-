import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PukkeConnect',
  password: 'yourpassword',
  port: 5432,
})

//app config
const app = express()
const port = process.env.PORT || 4000


//MIDDLEWARES
app.use(express.json()) //act as the middleware when the request is published  
app.use(cors())       //it allows frontend to connect to backend


//api endpoint
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.post('/api/interests', async (req, res) => {
    // Extract the student ID and interests from the request body.
    const { studentId, interests } = req.body;

    // A basic check to ensure the required data is present.
    if (!studentId || !interests) {
        return res.status(400).send({ message: 'Missing studentId or interests in the request.' });
    }

    try {
        // The `JSON.stringify` method serializes the array into a string format
        // that can be stored in the database's `Interests` column.
        const serializedInterests = JSON.stringify(interests);
        
        // This is a prepared statement that uses parameterized values ($1, $2)
        // to prevent SQL injection attacks.
        const sqlQuery = `
            UPDATE "STUDENT_USER"
            SET "Interests" = $1
            WHERE "Student_Id" = $2;
        `;
        
        // Execute the query using the connection pool.
        const result = await pool.query(sqlQuery, [serializedInterests, studentId]);

        // Check if the update was successful.
        // If rowCount is 0, no student with that ID was found.
        if (result.rowCount === 0) {
            return res.status(404).send({ message: 'Student ID not found. No interests were saved.' });
        }

        // Send a success response.
        console.log(`Successfully updated interests for student ID: ${studentId}`);
        res.status(200).send({ message: 'Interests saved successfully!' });
    } catch (err) {
        // Handle any errors that occur during the database operation.
        console.error('Error executing query', err.stack);
        res.status(500).send({ message: 'Error saving interests to the database.' });
    }
});

app.get('/api/societies', async (req, res) => {
    try {
        // Query the database to select all data from the "SOCIETY" table.
        const result = await pool.query('SELECT * FROM "SOCIETY"');

        // Check if any rows were returned.
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No societies found.' });
        }

        // Send the query results back as a JSON response.
        res.status(200).json(result.rows);
    } catch (err) {
        // Handle any errors that might occur during the database query.
        console.error('Error fetching societies:', err.stack);
        res.status(500).json({ message: 'Error fetching societies from the database.' });
    }
});

app.get('/api/students', async (req, res) => {
    try {
        // Query the database to select the Student_Id and Interests from the "STUDENT_USER" table.
        const result = await pool.query('SELECT "Student_Id", "Interests" FROM "STUDENT_USER"');

        // Check if any student rows were returned.
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No students found.' });
        }

        // Send the student data back as a JSON response.
        res.status(200).json(result.rows);
    } catch (err) {
        // Handle any errors that might occur during the database query.
        console.error('Error fetching students:', err.stack);
        res.status(500).json({ message: 'Error fetching students from the database.' });
    }
});

//START THE EXPRESS APP
app.listen(port, ()=> console.log("Server Started",port))