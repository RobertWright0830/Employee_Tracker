// Packages needed for this application
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const queries = require("./src/queries");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Error handling for database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
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
  const query = queries.viewAllDepartments;
  db.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching departments:', err.message);
    };
    console.log("");
    console.log("");
    console.table(res);
    start();
  });
};

// Function to view all roles
const viewAllRoles = () => {
  const query = queries.viewAllRoles;
  db.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching roles:', err.message);
    };
    console.log("");
    console.log("");
    console.table(res);
    start();
  });
};

// Function to view all employees
const viewAllEmployees = () => {
  const query = queries.viewAllEmployees;
  db.query(query, (err, res) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
    };
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
      const query = queries.addDepartment;
      db.query(query, { name: answer.department }, (err, res) => {
        if (err) {
          console.error('Error inserting department:', err.message);
          start();
          return;
        }
        console.log(`Added ${answer.department} to the database`);
        start();
      });
    });
};

// Function to add a role
const addRole = () => {
  //Fetch all departments from department table
  const query = queries.viewAllDepartmentsSimple;
  db.query(query, (err, departments) => {
    if (err) {
      console.error('Error fetching departments:', err.message);
      start();
          return;
        }

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
        const insertQuery = queries.addRole;
        db.query(
          insertQuery,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          (err, res) => {
            if (err) {
              console.error('Error inserting role:', err.message);
              start();
              return;
            }
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
  const roleQuery = queries.viewAllRolesSimple;
  db.query(roleQuery, (err, roles) => {
    if (err) {
      console.error('Error fetching roles:', err.message);
      start();
          return;
    }

    //Create a list of role choices
    const roleChoices = roles.map((role) => ({
      value: role.id,
      name: role.title,
    }));

    //Fetch all employees from employee table
    const managerQuery = queries.viewAllEmployeesSimple;
    db.query(managerQuery, (err, employees) => {
      if (err) {
        console.error('Error fetching employees:', err.message);
        start();
          return;
      }

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
          const query = queries.addEmployee;
          db.query(
            query,
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,
              manager_id: answer.manager_id,
            },
            (err, res) => {
              if (err) {
                console.error('Error adding employee:', err.message);
                start();
                return;
              }
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
  const employeeQuery = queries.viewAllEmployeesSimple;
  db.query(employeeQuery, (err, employees) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
      start();
          return;
    }

    // Create a list of employee choices
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    // Fetch the list of roles
    const roleQuery = queries.viewAllRolesSimple;
    db.query(roleQuery, (err, roles) => {
      if (err) {
        console.error('Error fetching roles:', err.message);
        start();
          return;
      }

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
          const query = queries.updateEmployeeRole;
          db.query(query, [answer.role_id, answer.employee_id], (err, res) => {
            if (err) {
              console.error('Error updating employee role:', err.message);
              start();
              return;
            }
            console.log("Updated employee's role");
            start();
          });
        });
    });
  });
};

// Function call to initialize app
start();
