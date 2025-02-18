import mysql from "mysql2";


export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "warnasri",
  database: "webnox",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

