import pkg from 'pg';
const { Client } = pkg;
const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'Mynotes', // Specify your database name
    password: 'admin1234',
    port: 5432
});

client.connect();

client.query('SELECT note FROM mynotes', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log(res.rows);
    }
});
