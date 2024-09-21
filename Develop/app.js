const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const questions = [];
function createQuestions(option1, option2, option3) {
    class Question {
        constructor(type, name, message) {
            this.type = type;
            this.name = name;
            this.message = message;
        }
    }
    let newQuestion = new Question(option1, option2, option3);
    questions.push(newQuestion);
}
createQuestions('input', 'name', 'What is the name of this employee?');
createQuestions('input', 'id', 'What is your employee ID number');
createQuestions('input', 'email', 'What is your email address?');
createQuestions('input', 'role', 'What is your role in the company?');
createQuestions('input', 'more', 'Do you want to add more members?');
async function getHTML() {
    let employees = [];
    let isDone = false;
    while (!isDone) {
        let response1 = await inquirer.prompt(questions);
        let newObject;
        let response2;
        switch (response1.role) {
            case 'Engineer':
                response2 = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'github',
                        message: 'What is your Github username?'
                    }
                )
                newObject = { ...response1, ...response2 }
                break;
            case 'Intern':
                response2 = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'school',
                        message: 'What school are you attending?'
                    }
                )
                newObject = { ...response1, ...response2 }
                break;
            case 'Manager':
                response2 = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'office number',
                        message: 'How many people do you manage?'
                    }
                )
                newObject = { ...response1, ...response2 }
                break;
        }
        switch (newObject.role) {
            case 'Intern':
                employees.push(new Intern(newObject.name, newObject.id, newObject.email, newObject.school))
                break;
            case 'Manager':
                employees.push(new Manager(newObject.name, newObject.id, newObject.email, newObject.officeNumber))
                break;
            case 'Engineer':
                employees.push(new Engineer(newObject.name, newObject.id, newObject.email, newObject.github))
                break;
        };
        if (response1.more === 'no') {
            isDone = true;
        };
    };
    fs.writeFile(outputPath, render(employees), err => {
        if (err) { throw err };
        console.log("A new html file was generated!");
    });
}
getHTML();