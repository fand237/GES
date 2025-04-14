require('dotenv').config();

module.exports = {
development: {
username: process.env.DB_USER || 'admin',
password: process.env.DB_PASSWORD || 'Password123',
database: process.env.DB_NAME || 'GestionEtablissement',
host: process.env.DB_HOST || '127.0.0.1',
port: process.env.DB_PORT || 3306,
dialect: 'mysql'
},
production: {
username: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
host: process.env.DB_HOST,
port: process.env.DB_PORT,
dialect: 'mysql'
}
};
