const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Blessing@16",
  database: "employee_trackerDB",
});

const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all Employees",
        "View Employees by Department",
        "View Employees by Manager",
        "Add an Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all Employees":
          viewEmployees();
          break;

        case "View Employees by Department":
          employeeByDepartment();
          break;

        case "View Employees by Manager":
          employeeByManager();
          break;

        case "Add and Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Manager":
          updateManager();
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
const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    cTable(res, [
      { id },
      { first_name },
      { last_name },
      { role_id },
      { manager_id },
    ]);
    start();
  });
};

const employeeByDepartment = () => {};

const employeeByManager = () => {};

const addEmployee = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the employees first name?",
      name: "employee_firstName",
    },
    {
      type: "inptut",
      message: "What is the employees last name?",
      name: "employee_lastName",
    },
    {
      type: "list",
      message: "What is the employees role?",
      name: "role",
      choices: [
        "Intern",
        "Software Engineer",
        "Engineering Manager",
        "Software Test Engineer",
        "Software Test Manager",
        "Sales Development Representative",
        "Sales Manager",
        "Customer Service Representative",
        "Customer Service Manager",
      ],
    },
  ]);
};

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
            //need to have the first and last name in a string be presented as the choices
            const employees = JSON.stringify("first_name" + "last_name");
            res.forEach((employees) => {
              actionArray.push(employees);
            });
            return actionArray;
          },
          message: "What employee would you like to fire?",
        },
      ])
      .then((answer) => {
        let chosenOne;
        connection.query("DELETE FROM employee WHERE ?", {
          chosenOne: answer.choice,
        });
        start();
      });
  });
};

const updateRole = () => {};

const updateManager = () => {};

connection.connect((err) => {
  if (err) throw err;
  start();
});
