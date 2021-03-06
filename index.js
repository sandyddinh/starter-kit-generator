#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
const consola = require('consola');
const exec = require('child_process').exec;

const CHOICES = fs.readdirSync(`${__dirname}/templates`);



const QUESTIONS = [
    {
      name: 'project-choice',
      type: 'list',
      message: 'If You Ready To Make Your Project witcha boi Big Poppa Code Select Get Started or else press CTRL + C to stop',
      choices: CHOICES
    },
    {
      name: 'project-name',
      type: 'input',
      message: 'Project name:',
      validate: function(input) {
        if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true;
      } else {
          return 'Project name may only include letters, numbers, underscores and hashes.';
        }
      }
    }
  ];


  const CURR_DIR = process.cwd();

  inquirer.prompt(QUESTIONS)
    .then(answers => {
      const projectChoice = answers['project-choice'];
      const projectName = answers['project-name'];
      const templatePath = `${__dirname}/templates/${projectChoice}`;

      fs.mkdirSync(`${CURR_DIR}/${projectName}`);
      consola.info(`Now building project in ${CURR_DIR}/${projectName}`);
      consola.info(`How's your day going btw, You should feel good about yourself`);
      consola.info('Coding is hard most people give up before they get this far...')
      consola.info('But your here now coding, using React an advanced UI Library');
      consola.info('Whoever you are just know, if no one else has told you...')
      consola.info('Ya boi Big Poppa Code is proud of you.... \n o yea and this could take a while')
      exec(`cd ${projectName} && npm install`, function (err, stdout, stderr ){
        if (err) {
          consola.error(`Dude heres your error it no big deal keep pushing: ${err}`)
          consola.warn(`These are warnings but they could help you also : ${stderr}`)
          return;
        }else {
          consola.warn(stdout);
          exec(`cd ${projectName} && npm audit`, function (err, stdout, stderr ){
            consola.warn('If you have any vulnerabilities trust that \n BrowserSync,Webpack, Gulp, React, and Babel are probably fixing them \n As long as its a dev dependency it wont effect our production code or the lesson, ask me if your not sure')
            consola.warn(stdout)
            consola.success('Looks like we built your React Project inside the directory you suggested, you can scroll up and see your output and any NPM Warnings :) ')
            consola.success(`It is finished.... well not really you still need to cd into the ${projectName} folder by running \n
              --------->   cd ${projectName}    <---------`)
            consola.success(`To help here is some useful info: \n
              you need to make sure you have gulp installed \n
              -----> npm i -g gulp-cli <----- \n
              to start the app you can run \n
              ----> npm run dev <----- \n
              If your Hungry For More \n you can hack the project yourself by editing  \n
              ------------> .babelrc (controls babel), gulpfile.js (controls gulp), webpack.config.js (controls webpack) <--------------
              `)
              consola.success(`happy coding ....... `)

          })

          return;
        }
      })
      createDirectoryContents(templatePath, projectName);
    });

    function createDirectoryContents (templatePath, newProjectPath) {
      const filesToCreate = fs.readdirSync(templatePath);

      filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);


        if (stats.isFile()) {
          const contents = fs.readFileSync(origFilePath, 'utf8');

          const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
          fs.writeFileSync(writePath, contents, 'utf8');
          let newFilePath
          if (file === '_gitignore') {
            newFilePath = '.gitignore';
            fs.renameSync(writePath, `${CURR_DIR}/${newProjectPath}/${newFilePath}`);
          } else if ( file === '_env'){
            newFilePath = '.env';
            fs.renameSync(writePath, `${CURR_DIR}/${newProjectPath}/${newFilePath}`);
          }

        } else if (stats.isDirectory()) {
          fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

          // recursive call
          createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
      });
    }
