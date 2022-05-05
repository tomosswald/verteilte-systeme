const express = require('express');
const bearer = require('express-bearer-token');
const Connector = require('./mariadb/connector');

const app = express();

const {
  handleCreateEntry,
  handleDeleteEntryById,
  handleGetEntries,
  handleGetEntryById,
  handleUpadateEntryById,
} = require('./controller/todo');

const { validateTodoSchema, validateTodoId, validateUpdateTodoSchema } = require('./utils/validate');

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(bearer());

// check for secret
app.use((req, res, next) => {
  if (req.token && req.token === process.env.SECRET) {
    next();
  } else {
    res.status(401).json({ code: 401, message: 'Unauthorized!' });
  }
});

// add validation and request handler to express
app.get('/todos', handleGetEntries);
app.get('/todos/:id', validateTodoId, handleGetEntryById);
app.post('/todos', validateTodoSchema, handleCreateEntry);
app.post('/todos/:id', validateUpdateTodoSchema, validateTodoId, handleUpadateEntryById);
app.delete('/todos/:id', validateTodoId, handleDeleteEntryById);

// IIFE is needed to handle top level async function
(async ()=>{
  //connect to database
  await Connector.of().connect(process.env.DB_HOST || 'localhost', process.env.DB_PASSWORD, process.env.DB_NAME).then(() => {
  // only if the database is connected, start the express server to retrieve requests
  app.listen(PORT, async () => { 
    console.log(`listening on port ${PORT}`); 
  });
  }).catch(()=>{
    console.error(`Verbindung zur Datenbank konnte nicht aufgebaut werden! HOST:${process.env.DB_HOST} PASSWORD:${process.env.DB_PASSWORD}`);
  });
})()

