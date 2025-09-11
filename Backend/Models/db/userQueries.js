/*import mongoose, { Schema } from 'mongoose'

const userSchema = new mangoose.Schema({
    name: {type :String, required: true},
    lastName :{type :string, required: true},
    password :{type :string, required:true}
    email : {type : string, required: Boolean , unique :Boolean},
    studentNumber : {type :, required:},
    fieldOfStufy :{type :string, required:true},
    campus :{type :string, required: true}
})

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

export default userModel*/

import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_dbname",
  password: "your_password",
  port: 5432,
});

// Insert a user
export async function createUser(user) {
  const query = `
    INSERT INTO users (name, lastName, password, email, studentNumber, fieldOfStudy, campus)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    user.name,
    user.lastName,
    user.password,
    user.email,
    user.studentNumber,
    user.fieldOfStudy,
    user.campus,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting user:", err);
    throw err;
  }
}