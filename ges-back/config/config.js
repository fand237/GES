require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || 'Password123',
        database: process.env.DB_NAME || 'GestionEtablissement',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectModule: require('mysql2'),

    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST || 'GestionEtablissement_test',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    },
    production: {
        username: process.env.MYSQL_USER || process.env.DB_USER,
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
        database: process.env.MYSQL_DATABASE || process.env.DB_NAME,
        host: process.env.MYSQL_HOST || process.env.DB_HOST,
        port: process.env.MYSQL_PORT || process.env.DB_PORT,
        dialect: 'mysql',
        dialectOptions: process.env.MYSQL_URL ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {},
        logging: false // Désactive les logs SQL en production
    }
};