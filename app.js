const inquirer = require('inquirer');
const cTable = require('console.table');

const { connection, getDepartments, getEmployees, getRoles } = require('./db/dbUtils.js')

//Inquirer prompt and questions
function questionsOpening() {
  inquirer
  .prompt({
    type: "list",
    name: "search",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit"
  ]

  }).then (function (answer) {
    switch (answer.search) {
          case "View all departments":
            viewAllDepartments();
            break;

          case "View all roles":
            viewAllRoles();
            break;

          case "View all employees":
             viewAllEmployees();
             break;

          case "Add a department":
            addDepartment();
            break;

          case "Add a role":
            addRole();
            break;

          case "Add an employee":
              addEmployee();
              break;

          case "Update an employee role":
              updateEmployeeRole();
              break;
          
          case "Exit":
              console.log("Bye!");
              connection.end();
              break
    }
  })
};

function viewAllDepartments() {
  //query to view all departments
  const query = connection.query("SELECT * FROM departments", function (err, res) {
      if (err) throw err
      console.log("\n Departments in database \n");
      console.table(res);
      questionsOpening();
  });
};

function viewAllRoles() {
  //query to view roles with department ID returned with name
  const query = connection.query("SELECT roles.id, roles.title, roles.salary, departments.name as department FROM roles JOIN departments ON roles.department_id = departments.id", function (err, res) {
      if (err) throw err
      console.log("\n All Roles \n")
      console.table(res);
      questionsOpening();
  });
};

function viewAllEmployees() {
  const query = connection.query("SELECT e1.id, e1.first_name, e1.last_name, roles.title as role, departments.name AS department, roles.salary, Concat(e2.first_name, ' ', e2.last_name) AS manager FROM employees e1 LEFT JOIN roles ON e1.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees e2 ON e2.id = e1.manager_id", function (err, res) {
      if (err) throw err
      console.log ("\n All Employees \n");
      console.table(res);
      questionsOpening();
  });
};

function addDepartment() {
  inquirer.prompt ({
      type: 'input',
      name: 'department',
      message: 'What is the name of the new department?'
  }).then(function(input) {
      console.log('Inserting a new department...\n');
      const query = connection.query(
        'INSERT INTO departments SET ?',
        {
          name: input.department
        },
        function(err, res) {
          if (err) throw err;
          console.log('Department added!\n');
          questionsOpening();
        });
  });
  
};

function addRole() {
  getDepartments()
  .then((rows) => {
      let departmentNamesArr = []
      let departmentArray = rows[0]
      for (var i=0; i < departmentArray.length; i++) {
        let department = departmentArray[i].name;
        departmentNamesArr.push(department)
      }

    inquirer.prompt([
      {
          type: "input",
          name: "roleTitle",
          message: "Enter the role title: "
      },
      {
          type: "number",
          name: "salary",
          message: "Enter the role salary: "
      },
      {   
          type: "list",
          name: "department",
          message: "Enter the department of the role: ",
          choices: departmentNamesArr
      }])
      .then((response) => {   
          let departmentID
          for (let i=0; i < departmentArray.length; i++) {
            if (response.department === departmentArray[i].name) {
              departmentID = departmentArray[i].id;
              break
            }
          }

        connection.query('INSERT INTO roles SET ?',
          {
            title: response.roleTitle,
            salary: response.salary,
            department_id: departmentID
          },
          function(err, res) {
            if (err) throw err;
            console.log(response.roleTitle + ' added to roles!\n');
            questionsOpening();
          });
      })
  })
};

function addEmployee() {
    getEmployees()
    .then((employees) => {
      let employeeNamesArr = []
      let employeesArray = employees[0]
      for (var i=0; i < employeesArray.length; i++) {
        let employee = employeesArray[i].first_name + ' ' + employeesArray[i].last_name
        employeeNamesArr.push(employee)
      }

      employeeNamesArr.unshift('--')
      getRoles()
       .then((roles) => {
        let roleTitlesArr = []
        let rolesArray = roles[0]
        for (var i=0; i < rolesArray.length; i++) {
          let role = rolesArray[i].title
          roleTitlesArr.push(role)
        }


          inquirer.prompt ([
          {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee: '
          },
          {
            type: 'input',
            name:'lastName',
            message: 'Enter the last name of the employee: '
          },
          {
            type: 'list',
            name: 'role',
            message: 'Choose the role of the employee: ',
            choices: roleTitlesArr
          },
          {
            type: 'list',
            name: 'manager',
            message: 'Choose the manager of the employee: ',
            choices: employeeNamesArr
          }])
          .then(function(input) {
            let roleID
            for (let i=0; i < rolesArray.length; i++) {
              if (input.role === rolesArray[i].title) {
              roleID = rolesArray[i].id;
              break
              }
            }

            let managerID
            for (let i=0; i < employeesArray.length; i++) {
              if (input.manager === employeesArray[i].first_name + ' ' + employeesArray[i].last_name) {
                managerID = employeesArray[i].id;
                break
              }
            }


            console.log('Adding a new employee...\n');
            const query = connection.query( 'INSERT INTO Employees SET ?',
              {
                first_name: input.firstName,
                last_name: input.lastName,
                role_id: roleID,
                manager_id: managerID
              },
              function(err, res) {
                if (err) throw err;
                console.log('Employee added!\n');
                questionsOpening();
              });
        });
      });
    });
};  

function updateEmployeeRole() {
  getEmployees()
    .then((employees) => {
      let employeeNamesArr = []
      let employeesArray = employees[0]
      for (var i=0; i < employeesArray.length; i++) {
        let employee = employeesArray[i].first_name + ' ' + employeesArray[i].last_name
        employeeNamesArr.push(employee)
      }
      getRoles()
      .then((roles) => {
         let roleTitlesArr = []
         let rolesArray = roles[0]
         for (var i=0; i < rolesArray.length; i++) {
           let role = rolesArray[i].title
           roleTitlesArr.push(role)
         }


         inquirer.prompt([
           {
             type: "list",
             name: "employee",
             message: "Which employee's role would you like to update?",
             choices: employeeNamesArr
           },
           {
             type: "list",
             name: "role",
             message: "What is their new role?",
             choices: roleTitlesArr
           }])
         .then((input) => {
          let roleID
          for (let i=0; i < rolesArray.length; i++) {
            if (input.role === rolesArray[i].title) {
            roleID = rolesArray[i].id;
            break
            }
          }

          let employeeID
          for (let i=0; i < employeesArray.length; i++) {
            if (input.employee === employeesArray[i].first_name + ' ' + employeesArray[i].last_name) {
              employeeID = employeesArray[i].id;
              break
            }
          }
      
          console.log('Updating employee role...\n');
          // Update employee role
          connection.query('UPDATE employees SET ? WHERE ?', [
                  {
                    role_id: roleID
                  },
                  {
                    id: employeeID
                  }
                ],
                function(err, res) {
                  if (err) throw err;
                  console.log('Role updated!\n');
                  questionsOpening();
                }
            );
          });
        });
    });
};

questionsOpening()
