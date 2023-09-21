# SoftForm Application #

Repositório para controle de versão do projeto SoftForm. Aplicativo PWA (Progressive Web Apps) para Android e iOS. É um aplicativo soft-coding, dessa forma as telas com as perguntas e alternativas são geradas automaticamente, com base nas informações que estão armazenadas no banco. Neste repositório estão armazenados os códigos referentes ao Front-end, Mobile, Back-end e Banco de dados. A seguir, estão descritas as etapas de instalação e implantação tanto do backend como do frontend.

# Back-end

The back-end application of the project is located under `backend` folder and has been developed using NodeJS and MySQL. It also contains the scripts for creating populatingcreate and populate scripts for the database.

## Installation

### Pre-requisites
  * [Node.js](https://nodejs.org/en/)
  * [MySQL](https://www.mysql.com/), or any other db supported by  [knex](http://knexjs.org/#Installation-node)

#### Main Node Packages Used

These are the main node packages used during development, for reference.

  * [Express](https://expressjs.com/)
  * [Knex](http://knexjs.org/)
  * [PM2](https://pm2.keymetrics.io/)
  
### Steps

1. Clone or download this repository;
2. Open a terminal window inside the backend folder;
3. Run `npm i` to download and install all dependencies;
4. On the root directory, create a copy of the file `.env.example` and edit it with your specific configurations to run the application. When finished, rename the file to `.env`;

    4.1. Fields meaning

    The prefixes `PROD_` and `DEV_` indicate parameters especific to each environment (production and development).

        DB_CLIENT: name of knex database client;
        DB_NAME: name of your schema;
        DB_USER: database username;
        DB_PASS: database password;
        DB_HOST: either <IP> or <IP>:<PORT> (if not on default port) of the host database;
        PRIVATEKEY_PATH: path to ssl private key file
        CERTIFICATE_PATH: path to ssl certificate file
        CHAIN_PATH: path to ssl chain file
        PORT: backend port;
        HOST: backend address;
        NMB_DAYS: minimum days required to allow new monitoring answers;

5. Run the script: `npm run database` to create and populate the tables used in this application;

Now you have installed and configured the back-end.



# Front-end

## Usage

To run the application, simply open a terminal inside the backend folder and execute: `npm start`

## Deploy

To deploy we used PM2, which is a daemon process manager that will manage the execution of the backend.

To install PM2, open a terminal and run the command: `npm install pm2 -g`.

To setup the application, you'll first need to configure SSL for you server. If the folder which the private key, certificate and chain files are located needs root privileges, all the following commands must be executed with the root user (or using sudo). To do so, run the command `sudo -i`.

1. Next, navigate to the backend folder: `cd <PATH_TO_PROJECT>/softform/backend`;
2. Execute: `pm2 start src/index.js --name <NAME_OF_APP> --watch`;
3. To make it automatically run at startup: `pm2 startup`;
4. Save changes with: `pm2 save`;
5. Check if app is running with `pm2 list`.
