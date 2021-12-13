// DEPENDENCIES
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// MAKE CONNECTION TO THE DATABASE
const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  console.log("---------------------------------------------\n");
  init();
});

// Shows all employees
function viewAllEmployees() {
  const queryString = `
  SELECT CONCAT(e.first_name," ",e.last_name) as 'Employee Name', r.title as 'Role', r.salary as 'Salary', IFNULL(CONCAT(m.first_name," ",m.last_name),'No Manager') as 'Manager Name'
    FROM employees e
    LEFT JOIN employees m
        on e.manager_id = m.id
    INNER JOIN roles r
        on r.id = e.role_id;
    `;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  });
}

//  Shows all employees by department
function viewAllEmployeesByDepartment() {
  const queryString = `SELECT * FROM departments;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const departmentsArray = data.map((department) => {
      return { name: department.name, value: department.id };
    });
    // console.log(departmentsArray);
    inquirer
      .prompt([
        {
          type: "list",
          choices: departmentsArray,
          message: "Please select a department",
          name: "departmentId",
        },
      ])
      .then(({ departmentId }) => {
        const queryString = `SELECT e.first_name as 'First Name', e.last_name as 'Last Name', d.name as 'Department'
                FROM employees e, roles r, departments d
                WHERE e.role_id = r.id AND r.department_id = ? AND d.id = ?;`;
        connection.query(
          queryString,
          [departmentId, departmentId],
          (err, data) => {
            if (err) throw err;
            console.table(data);
            init();
          }
        );
      });
  });
}

// Shows all employees by manager
function viewAllEmployeesByManager() {
  const queryString = `SELECT CONCAT(e.first_name," ", e.last_name) as 'Employee', r.title as 'Title', d.name as 'Department', IFNULL(CONCAT(m.first_name," ", m.last_name),'No Manager') as 'Manager' 
    FROM employees e
    LEFT JOIN employees m
        on m.id = e.manager_id
    INNER JOIN roles r
        on e.role_id = r.id
    INNER JOIN departments d
        on r.department_id = d.id;
    `;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  });
}

// Adds an employee
function addEmployee() {
  const queryString = `SELECT * FROM roles;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const rolesArray = data.map((role) => {
      return { name: role.title, value: role.id };
    });
    const queryString = `SELECT * FROM employees;`;
    connection.query(queryString, (err, data) => {
      if (err) throw err;
      const employeeArray = data.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
      });
      const noneOption = { name: "None", value: null };
      employeeArray.unshift(noneOption);
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName",
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName",
          },
          {
            type: "list",
            message: "Please select the employee's role",
            choices: rolesArray,
            name: "role",
          },
          {
            type: "list",
            message: "Please select the employee's manager",
            choices: employeeArray,
            name: "manager",
          },
        ])
        .then(({ firstName, lastName, role, manager }) => {
          const queryString = `
          INSERT INTO employees (first_name, last_name, role_id, manager_id)
          VALUE (?, ?, ?,?);`;
          connection.query(
            queryString,
            [firstName, lastName, role, manager],
            (err, data) => {
              if (err) throw err;
              console.log("The employee has been added!");
              init();
            }
          );
        });
    });
  });
}

// Delete an employee
function deleteEmployee() {
  const queryString = `SELECT * FROM employees;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const employeeArray = data.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "Please select the employee's manager",
          choices: employeeArray,
          name: "employee",
        },
      ])
      .then(({ employee }) => {
        const queryString = `
        DELETE FROM employees
        WHERE id = ?;`;
        connection.query(queryString, [employee], (err, data) => {
          if (err) throw err;
          console.log("Successfully deleted the employee");
          init();
        });
      });
  });
}

// Update an employees' role
function updateEmployeeRole() {
  const queryString = `SELECT * FROM roles;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const rolesArray = data.map((role) => {
      return { name: role.title, value: role.id };
    });
    const queryString = `SELECT * FROM employees;`;
    connection.query(queryString, (err, data) => {
      if (err) throw err;
      const employeeArray = data.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            name: "employee",
            choices: employeeArray,
          },
          {
            type: "list",
            message: "Which role would you like to assign the employee?",
            name: "role",
            choices: rolesArray,
          },
        ])
        .then(({ employee, role }) => {
          const queryString = `UPDATE employees
          SET role_id = ?
          WHERE id = ?;`;
          connection.query(queryString, [role, employee], (err, data) => {
            if (err) throw err;
            console.log("The employee's role has been updated!");
            init();
          });
        });
    });
  });
}

// Update an employee's manager
function updateManager() {
  const queryString = `SELECT * FROM employees;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const employeeArray = data.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          choices: employeeArray,
          message: "Choose and employee to update:",
          name: "employee",
        },
        {
          type: "list",
          choices: employeeArray,
          message: "Select the employee's new manager:",
          name: "manager",
        },
      ])
      .then(({ employee, manager }) => {
        const queryString = `UPDATE employees
          SET manager_id = ?
          WHERE id = ?;`;
        connection.query(queryString, [manager, employee], (err, data) => {
          if (err) throw err;
          console.log("The employee has been updated.");
          init();
        });
      });
  });
}

// View all departments
function viewDepartments() {
  const queryString = `SELECT * FROM departments;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  });
}

// Add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the name of the department to create",
        name: "department",
      },
    ])
    .then(({ department }) => {
      const queryString = `
            INSERT INTO departments (name)
            VALUE (?);`;
      connection.query(queryString, [department], (err, data) => {
        if (err) throw err;
        console.log("Your department has been created.");
        init();
      });
    });
}

// View all roles
function viewRoles() {
  const queryString = `
  SELECT r.id, r.title, r.salary, d.name as 'Department'
  FROM roles r
  LEFT JOIN departments d
      on r.department_id = d.id;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  });
}

// Add a role
function addRole() {
  const queryString = `SELECT * FROM departments;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const departmentsArray = data.map((department) => {
      return { name: department.name, value: department.id };
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "Please enter the role title:",
          name: "title",
        },
        {
          type: "input",
          message: "Please enter the role salary:",
          name: "salary",
        },
        {
          type: "list",
          choices: departmentsArray,
          message: "Please select a department:",
          name: "department_id",
        },
      ])
      .then(({ title, salary, department_id }) => {
        const queryString = `
      INSERT INTO roles (title, salary, department_id)
      VALUE (?, ?, ?);`;
        connection.query(
          queryString,
          [title, salary, department_id],
          (err, data) => {
            if (err) throw err;
            console.log("Your department has been created.");
            init();
          }
        );
      });
  });
}

// Exits the application
function quit() {
  connection.end();
  console.log("****** Goodbye! ***** \n");
}

// Starts the application
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee's role",
          "Update an employee's manager",
          "Delete an employee",
          new inquirer.Separator(),
          "Quit",
          new inquirer.Separator(),
        ],
        message: "What would you like to do?",
        name: "userInput",
      },
    ])
    .then(({ userInput }) => {
      switch (userInput) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all employees by department":
          viewAllEmployeesByDepartment();
          break;
        case "View all employees by manager":
          viewAllEmployeesByManager();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Update an employee's role":
          updateEmployeeRole();
          break;
        case "Update an employee's manager":
          updateManager();
          break;
        case "View all departments":
          viewDepartments();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "Add a role":
          addRole();
          break;
        default:
          quit();
      }
    });
}
