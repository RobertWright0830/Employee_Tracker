// Packages needed for this application
const inquirer = require("inquirer");
const mysql = require("mysql");



// Connect to database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Emdbosmtl1123!",
    database: "employees_db",
});

// Function to start the application
const start = () => {
    inquirer.prompt({
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
            "Exit"]
    }).then((answer) => {
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
    
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
                
            case "View All Employees By Manager":
                viewAllEmployeesByManager();
                break;
        
            case "View All Employees By Department":
                viewAllEmployeesByDepartment();
                break;

            case "Remove Department":
                removeDepartment();
                break;
    
            case "Remove Role":
                removeRole();
                break;
    
            case "Remove Employee":
                removeEmployee();
                break;

            case "Total Utilized Salary Budget of a Department":
                totalUtilizedSalaryBudgetOfADepartment();
                break;
           
            case "Exit":
                connection.end();
                break;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
}

// Function to view all departments
const viewAllDepartments = () => {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to view all roles
const viewAllRoles = () => {
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to view all employees
const viewAllEmployees = () => {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to add a department
const addDepartment = () => {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the name of the department?"
    }).then((answer) => {
        const query = "INSERT INTO department SET ?";
        connection.query(query, { name: answer.department }, (err, res) => {
            if (err) throw err;
            console.log("Added {answer.department} to the database");
            start();
        });
    });
}

// Function to add a role
const addRole = () => {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?"
        },
        {
            name: "department_id",
            type: "list",
            message: "Which department does the role belong to?"
            //include list of departments on department table


        }
    ]).then((answer) => {
        const query = "INSERT INTO role SET ?";
        connection.query(query, { title: answer.title, salary: answer.salary, department_id: answer.department_id }, (err, res) => {
            if (err) throw err;
            console.log("Added {answer.title} to the database");
            start();
        });
    });
}

// Function to add an employee
const addEmployee = () => {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employhee's last name?"
        },
        {
            name: "role_id",
            type: "list",
            message: "What is the employee's role?"
            //include list of roles on role table

        },
        {
            name: "manager_id",
            type: "list",
            message: "Who is the employee's manager?"
            //include list of managers on employee table

        }
    ]).then((answer) => {
        const query = "INSERT INTO employee SET ?";
        connection.query(query, { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id, manager_id: answer.manager_id }, (err, res) => {
            if (err) throw err;
            console.log("Added {answer.first_name answer.last_name} to the database");
            start();
        });
    });
}

// Function to update an employee role
const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role_id",
            type: "list",
            message: "Which role do you want to assign to the selected employee?"
            //include list of roles on role table
        }
    ]).then((answer) => {
        const query = "UPDATE employee SET role_id = ? WHERE id = ?";
        connection.query(query, [answer.role_id, answer.employee_id], (err, res) => {
            if (err) throw err;
            console.log("Employee role updated successfully!");
            start();
        });
    });
}

// Function to update an employee manager
const updateEmployeeManager = () => {
    inquirer.prompt([
        {
            name: "employee_id",
            type: "input",
            message: "What is the id of the employee you would like to update?"
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the manager id of the employee you would like to update?"
        }
    ]).then((answer) => {
        const query = "UPDATE employee SET manager_id = ? WHERE id = ?";
        connection.query(query, [answer.manager_id, answer.employee_id], (err, res) => {
            if (err) throw err;
            console.log("Employee manager updated successfully!");
            start();
        });
    });
}

// Function to view all employees by manager
const viewAllEmployeesByManager = () => {
    inquirer.prompt({
        name: "manager_id",
        type: "input",
        message: "What is the manager id of the employees you would like to view?"
    }).then((answer) => {
        const query = "SELECT * FROM employee WHERE manager_id = ?";
        connection.query(query, [answer.manager_id], (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        });
    });
}

// Function to view all employees by department
const viewAllEmployeesByDepartment = () => {
    inquirer.prompt({
        name: "department_id",
        type: "input",
        message: "What is the department id of the employees you would like to view?"
    }).then((answer) => {
        const query = "SELECT * FROM employee WHERE department_id = ?";
        connection.query(query, [answer.department_id], (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        });
    });
}

// Function to remove a department
const removeDepartment = () => {
    inquirer.prompt({
        name: "department_id",
        type: "input",
        message: "What is the id of the department you would like to remove?"
    }).then((answer) => {
        const query = "DELETE FROM department WHERE id = ?";
        connection.query(query, [answer.department_id], (err, res) => {
            if (err) throw err;
            console.log("Department removed successfully!");
            start();
        });
    });
}

// Function to remove a role
const removeRole = () => {
    inquirer.prompt({
        name: "role_id",
        type: "input",
        message: "What is the id of the role you would like to remove?"
    }).then((answer) => {
        const query = "DELETE FROM role WHERE id = ?";
        connection.query(query, [answer.role_id], (err, res) => {
            if (err) throw err;
            console.log("Role removed successfully!");
            start();
        });
    });
}

// Function to remove an employee
const removeEmployee = () => {
    inquirer.prompt({
        name: "employee_id",
        type: "input",
        message: "What is the id of the employee you would like to remove?"
    }).then((answer) => {
        const query = "DELETE FROM employee WHERE id = ?";
        connection.query(query, [answer.employee_id], (err, res) => {
            if (err) throw err;
            console.log("Employee removed successfully!");
            start();
        });
    });
}

// Function to view total utilized salary budget of a department
const totalUtilizedSalaryBudgetOfADepartment = () => {
    inquirer.prompt({
        name: "department_id",
        type: "input",
        message: "What is the id of the department you would like to view the total utilized salary budget of?"
    }).then((answer) => {
        const query = "SELECT SUM(salary) FROM employee WHERE department_id = ?";
        connection.query(query, [answer.department_id], (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        });
    });
}

// Function call to initialize app
start();

