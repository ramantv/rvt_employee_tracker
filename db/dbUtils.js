const mysql = require('mysql2')
const promisemysql = require('mysql2/promise');

function getDepartments() {
    return connection.promise().query("SELECT * FROM departments")
  };
  
  function getRoles() {
    return connection.promise().query("SELECT * FROM roles")
  };
  
  function getEmployees () {
    return connection.promise().query("SELECT * FROM employees")
  };

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employee_tracker_db',
  });

  connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected to database.")
  });

module.exports = { connection, getDepartments,
    getRoles,
    getEmployees }
