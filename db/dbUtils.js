const mysql = require('mysql2')
//const promisemysql = require('mysql2/promise');

function getDepartments() {
    return dbConnection.promise().query("SELECT * FROM departments")
  };
  
  function getRoles() {
    return dbConnection.promise().query("SELECT * FROM roles")
  };
  
  function getEmployees () {
    return dbConnection.promise().query("SELECT * FROM employees")
  };

const dbConnection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db',
  });

  dbConnection.connect(function(err) {
      if (err) throw err;
      console.log("Connected to database employee_tracker_db.")
  });

module.exports = { dbConnection, getDepartments,
    getRoles,
    getEmployees }
