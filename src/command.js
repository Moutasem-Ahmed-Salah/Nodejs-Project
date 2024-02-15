import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pkg from 'pg';
const { Client } = pkg;


const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'Mynotes', 
  password: 'admin1234',
  port: 5432
});


client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database', err);
  });

yargs(hideBin(process.argv))
  .command('new <note>', 'create a new note', yargs => {
    return yargs
      .positional('note', {
        describe: 'The content of the note you want to create',
        type: 'string'
      })
      .option('tags', {
        alias: 't',
        type: 'string',
        description: 'tags to add to the note'
      });
  }, async (argv) => {
    const { note, tags } = argv;
    
    try {
      const insertQuery = 'INSERT INTO mynotes (note) VALUES ($1)';
      const values = [note];
      const result = await client.query(insertQuery, values);
      console.log('Note inserted successfully:', note);
    } catch (error) {
      console.error('Error inserting note into the database:', error);
    }
    console.log(argv.note);
  })
  .command('all', 'get all notes', () => {}, async () => {
    try {
      const result = await client.query('SELECT note FROM mynotes');
        const notes = result.rows.map(row => row.note).join('\n');
        console.log('All notes:');
        console.log(notes);
    } catch (error) {
      console.error('Error retrieving all notes:', error);
    }
  })
  .command('find <id>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
    try {
      const findQuery = 'select note FROM mynotes WHERE id = $1';
      const values = [argv.id];
      const result = await client.query(findQuery, values);
      const notes = result.rows.map(row => row.note).join('\n');
      console.log('Matching notes:',notes);
    }
    catch (error) {
      console.error('Error removing note from the database:', error);
    }
  })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
    try {
      const deleteQuery = 'DELETE FROM mynotes WHERE id = $1';
      const values = [argv.id];
      const result = await client.query(deleteQuery, values);
      console.log('Note removed successfully:', argv.id);
    }
    catch (error) {
      console.error('Error removing note from the database:', error);
    }
  })
  .command('web [port]', 'launch website to see notes', yargs => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number'
      })
  }, async (argv) => {
    
  })
  .command('clean', 'remove all notes', () => {}, async (argv) => {
  })
  .demandCommand(1)
  .parse();
