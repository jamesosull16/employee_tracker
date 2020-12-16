const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const logo = require("asciiart-logo");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Blessing@16",
  database: "employee_trackerDB",
});

console.log(
  logo({
    name: "Employee Manager",
    font: "AMC Razor",
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: "cyan",
    logoColor: "bold-red",
    textColor: "red",
  })
    .emptyLine()
    .emptyLine()
    .render()
);

const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all Employees",
        "View all Departments",
        "View all Roles",
        "Add an Employee",
        "Add a Department",
        "Add a Role",
        "Update Employee Role",
        "View Employees by Department",
        "Update Employee Manager",
        "View Employees by Manager",
        "Remove Employee",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all Employees":
          viewEmployees();
          break;

        case "View all Departments":
          viewDepartments();
          break;

        case "View all Roles":
          viewRoles();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Add a Department":
          addDepartment();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "View Employees by Department":
          employeeByDepartment();
          break;

        case "Update Employee Manager":
          updateManager();
          break;

        case "View Employees by Manager":
          employeeByManager();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Exit":
          connection.end();
          break;

        default:
          console.log(`Invalid Action: ${answer.action}`);
          break;
      }
    });
};

//functions
//need left join
const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

//need left join
const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

//need left join
const viewRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

//INSERT INTO
//still needs work
const addEmployee = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the employees first name?",
          name: "employee_firstName",
        },
        {
          type: "input",
          message: "What is the employees last name?",
          name: "employee_lastName",
        },
        {
          name: "action",
          type: "list",
          choices() {
            const choiceArray = [];
            results.forEach((roles) => {
              let employeeRole = roles.title;
              choiceArray.push(employeeRole);
            });
            return choiceArray;
          },
          message: "What is the employee's role?",
        },
      ])
      .then((answer) => {
        connection.query("INSERT INTO employee SET ?"),
        {
          first_name = answer.employee_firstName,
          last_name = answer.employee_lastName,
          role_id = answer.action,
          manager_id = answer.manager,
        },
        (err) => {
          if (err) throw err;
          console.log('The new employee has been added to the team!');
          start();
        }
      });
  });
};

//INSERT INTO
const addDepartment = () => {};

//INSERT INTO
const addRole = () => {};

//UPDATE SET
const updateRole = () => {};

const updateManager = () => {};

//inner join employee and role
const employeeByManager = () => {};

//inner join employee and department
const employeeByDepartment = () => {};

const removeEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "action",
          type: "list",
          choices() {
            const actionArray = [];
            res.forEach((employees) => {
              let fullName =
                employees.id +
                " " +
                employees.first_name +
                " " +
                employees.last_name;
              actionArray.push(fullName);
            });
            return actionArray;
          },
          message: "What employee would you like to fire?",
        },
      ])
      .then((answer) => {
        let parts = answer.action.split(" ");
        let chosenId = parts[0];
        connection.query("DELETE FROM employee WHERE id = ?", chosenId);
        start();
      });
  });
};

connection.connect((err) => {
  if (err) throw err;
  start();
});
