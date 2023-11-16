const Sequelize = require('sequelize'); //importing sequelize library
require('dotenv').config(); //importing dotenv library and calling the config method. This loads the environment variables from the .env file into process.env.

let sequelize; //creating a variable to hold the sequelize instance

if (process.env.JAWSDB_URL) { //if the JAWSDB_URL environment variable exists, then the code will execute the following:
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else { //if the JAWSDB_URL environment variable doesn't exist, then the code will execute the following:
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: '127.0.0.1', //localhost
      dialect: 'mysql', //telling sequelize that we want to connect to a MySQL database
      port: 3306 //default port
    }
  );
}

module.exports = sequelize;