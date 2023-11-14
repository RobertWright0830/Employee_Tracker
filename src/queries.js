//SQL Queries for the Employee Tracker application

const queries = {
    //Retrieve all departments, roles, or employees with more detailed information
    viewAllDepartments: "SELECT * FROM department ORDER BY id",
    viewAllRoles: "SELECT role.id, role.title, department.name AS department, ROUND(role.salary) AS salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id",
    viewAllEmployees: "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, ROUND(role.salary) AS salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS mgr ON employee.manager_id = mgr.id ORDER BY employee.id",

    //Add new departments, roles, or employees
    addDepartment: "INSERT INTO department SET ?",
    addRole: "INSERT INTO role SET ?",
    addEmployee: "INSERT INTO employee SET ?",

    //View Simple lists of departments, roles, or employees for use in inquirer lists
    viewAllDepartmentsSimple: "SELECT * FROM department ORDER BY name",
    viewAllRolesSimple: "SELECT * FROM role ORDER BY title",
    viewAllEmployeesSimple: "SELECT * FROM employee ORDER BY last_name, first_name",

    //Update an employee's role
    updateEmployeeRole: "UPDATE employee SET role_id = ? WHERE id = ?",    
};

module.exports = queries;