// Packages needed for this application
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Emdbosmtl1123!",
  database: "employees_db",
});

// Function to start the application
const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Employees By Manager",
        "View All Employees By Department",
        "Remove Department",
        "Remove Role",
        "Remove Employee",
        "Total Utilized Salary Budget of a Department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          db.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// Function to view all departments
const viewAllDepartments = () => {
  const query = "SELECT * FROM department ORDER BY id";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log("");
    console.log("");
    console.table(res);
    start();
  });
};

// Function to view all roles
const viewAllRoles = () => {
  const query =
    "SELECT role.id, role.title, department.name AS department, ROUND(role.salary) AS salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log("");
    console.log("");
    console.table(res);
    start();
  });
};

// Function to view all employees
const viewAllEmployees = () => {
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, ROUND(role.salary) AS salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS mgr ON employee.manager_id = mgr.id ORDER BY employee.id";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log("");
    console.log("");
    console.table(res);
    start();
  });
};

// Function to add a department
const addDepartment = () => {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the department?",
    })
    .then((answer) => {
      const query = "INSERT INTO department SET ?";
      db.query(query, { name: answer.department }, (err, res) => {
        if (err) throw err;
        console.log(`Added ${answer.department} to the database`);
        start();
      });
    });
};

// Function to add a role
const addRole = () => {
  //Fetch all departments from department table
  const query = "SELECT * FROM department";
  db.query(query, (err, departments) => {
    if (err) throw err;

    //Create a list of department choices
    const departmentChoices = departments.map((department) => ({
      value: department.id,
      name: department.name,
    }));

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the name of the role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role?",
        },
        {
          name: "department_id",
          type: "list",
          message: "Which department does the role belong to?",
          choices: departmentChoices,
        },
      ])
      .then((answer) => {
        const insertQuery = "INSERT INTO role SET ?";
        db.query(
          insertQuery,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.title} to the database`);
            start();
          }
        );
      });
  });
};

// Function to add an employee
const addEmployee = () => {
  //Fetch all roles from role table
  const roleQuery = "SELECT * FROM role";
  db.query(roleQuery, (err, roles) => {
    if (err) throw err;

    //Create a list of role choices
    const roleChoices = roles.map((role) => ({
      value: role.id,
      name: role.title,
    }));

    //Fetch all employees from employee table
    const managerQuery = "SELECT * FROM employee";
    db.query(managerQuery, (err, employees) => {
      if (err) throw err;

      //Create a list of manager choices
      const managerChoices = [
        { value: null, name: "None" },
        ...employees.map((employee) => ({
          value: employee.id,
          name: employee.first_name + " " + employee.last_name,
        })),
      ];

      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employhee's last name?",
          },
          {
            name: "role_id",
            type: "list",
            message: "What is the employee's role?",
            choices: roleChoices,
          },
          {
            name: "manager_id",
            type: "list",
            message: "Who is the employee's manager?",
            choices: managerChoices,
          },
        ])
        .then((answer) => {
          const query = "INSERT INTO employee SET ?";
          db.query(
            query,
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,
              manager_id: answer.manager_id,
            },
            (err, res) => {
              if (err) throw err;
              console.log(
                `Added ${answer.first_name} ${answer.last_name} to the database`
              );
              start();
            }
          );
        });
    });
  });
};

// Function to update an employee role
const updateEmployeeRole = () => {
  // Fetch the list of employees
  const employeeQuery = "SELECT * FROM employee";
  db.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    // Create a list of employee choices
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    // Fetch the list of roles
    const roleQuery = "SELECT * FROM role";
    db.query(roleQuery, (err, roles) => {
      if (err) throw err;

      // Create a list of role choices
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            name: "employee_id",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices,
          },
          {
            name: "role_id",
            type: "list",
            message:
              "Which role do you want to assign to the selected employee?",
            choices: roleChoices,
          },
        ])
        .then((answer) => {
          const query = "UPDATE employee SET role_id = ? WHERE id = ?";
          db.query(query, [answer.role_id, answer.employee_id], (err, res) => {
            if (err) throw err;
            console.log("Updated employee's role");
            start();
          });
        });
    });
  });
};

// Function call to initialize app
start();