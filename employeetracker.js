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
        "Update Employee by Role",
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

        case "Update Employee by Role":
          updateEmployeeRole();
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

const viewEmployees = () => {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, manager.last_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewRoles = () => {
  connection.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

//INSERT INTO
//still needs work
const addEmployee = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "fist",
        type: "input",
        message: "What is the new employees first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is the new employees last name?",
      },
      {
        name: "action",
        type: "list",
        choices: results.map((department) => ({
          name: department.name,
          value: department,
        })),
        message: "What department does this new employee belong in?",
      },
    ]);
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "dept",
        type: "input",
        message: "What department would you like to add the organization?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        { name: answer.dept },
        (err) => {
          if (err) throw err;
          console.log(`${answer.dept} has been added to the org!`);
          viewDepartments();
          start();
        }
      );
    });
};

//INSERT INTO
const addRole = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the new role you would like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the base salary for this new position?",
          validate(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          },
        },
        {
          name: "action",
          type: "list",
          choices: results.map((department) => ({
            name: department.name,
            value: department,
          })),
          message: "What department does this new role belong in?",
        },
        
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.action.id,
          },
          (err) => {
            if (err) throw err;
            console.log(
              `${answer.title} has been added to ${answer.action.name}!`
            );
            viewRoles();
            start();
          }
        );
      });
  });
};
//UPDATE SET
const updateEmployeeRole = () => {
  const query = "SELECT * FROM employee";
  //select * employees as choices
  //select * roles as choices
  // UPDATE employee SET role_id = ? WHERE id = ?
  //pass an array for the question marks...one for role_id and other for id
};

const updateManager = () => {
  console.log("Still under construction!");
  start();
};

//inner join employee and role
const employeeByManager = () => {
  console.log("Still under construction!");
};

//inner join employee and department
const employeeByDepartment = () => {
  console.log("Still under construction!");
  start();
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
        let fired = parts.splice(1).join(" ");
        console.log(`${fired} has been fired!`);
        start();
      });
  });
};

connection.connect((err) => {
  if (err) throw err;
  start();
});
