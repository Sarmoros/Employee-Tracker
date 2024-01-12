const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_tracker_db'
},

console.log(`Connected to the employee_tracker_db database.`)
);

function startApp() {
    const logoText = logo({ name: "Employee Tracker" }).render();
    console.log(logoText);
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View all employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View all departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'View all roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Add an employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Add a department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Add a role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Update an employee role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'Quit',
                    value: 'QUIT'
                }
            ]
        }
    ]).then((res)=> {
        let choices = res.choice;
        switch (choices) {
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'VIEW_ROLES':
                viewRoles();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
                break;
            default:
                quit();
        }
    })
        ;
};

function viewEmployees() {
    db.query('SELECT  e.id AS employee_id,  e.first_name,  e.last_name,  r.title AS job_title,  name AS department,  r.salary,  CONCAT(m.first_name, \' \', m.last_name) AS manager_name FROM   employee e JOIN   role r ON e.role_id = r.id JOIN   department d ON r.department_id = d.id LEFT JOIN   employee m ON e.manager_id = m.id;', function (err, results) {
        console.table(results);
        startApp();
    });
};

function viewDepartments() {
    db.query('SELECT id AS department_id, name AS department_name FROM department;', function (err, results) {
        console.table(results);
        startApp();
    });
};

function viewRoles() {
    db.query('SELECT id AS role_id, title AS job_title, salary, department_id FROM role;', function (err, results) {
        console.table(results);
        startApp();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you would like to add?'
        }
    ]).then((res) => {
        db.query('INSERT INTO department SET ?', { name: res.department }, function (err, results) {
            viewDepartments();
        });
    });
}

function addRole() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        const departmentChoices = results.map(({ id, name }) => ({
            name: name,
            value: id
        }));
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role you would like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'What is the department ID for this role?',
            choices: departmentChoices
        }
    ]).then((res) => {
        db.query('INSERT INTO role SET ?', { title: res.role, salary: res.salary, department_id: res.department_id }, function (err, results) {
            viewRoles();
        });
    });
})
};

function addEmployee() {
    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        const roleChoices = results.map(({ id, title }) => ({
            name: title,
            value: id
        }));
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        const managerChoices = results.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        managerChoices.push({ name: 'None', value: null });
    inquirer.prompt ([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee you would like to add?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee you would like to add?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the role ID for this employee?',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'What is the manager ID for this employee?',
            choices: managerChoices
        }
    ]).then((res) => {
        db.query('INSERT INTO employee SET ?', { first_name: res.first_name, last_name: res.last_name, role_id: res.role_id, manager_id: res.manager_id }, function (err, results) {
            viewEmployees();
        });
    });
}
)}
)}

function updateEmployeeRole() {
    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        const roleChoices = results.map(({ id, title }) => ({
            name: title,
            value: id
        }));
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        const employeeChoices = results.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to update?',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the new role ID for this employee?',
            choices: roleChoices
        }
    ]).then((res) => {
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [res.role_id, res.employee_id], function (err, results) {
            viewEmployees();
        });
    });
}
)}
)}


function quit() {
    console.log('Goodbye!');
    process.exit();
}



startApp();
