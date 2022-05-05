const db = require('../mariadb/connector').of()

async function handleCreateEntry(req, res) {
  const { code, body } = await db.createTodo(req.body);
  res.status(code).json(body)
}

async function handleGetEntryById(req, res) {
  const { code, body } = await db.getTodoById(req.params.id);
  res.status(code).json(body);
}

async function handleGetEntries(req, res) {
  const { code, body } = await db.getTodos();
  res.status(code).json(body);
}

async function handleDeleteEntryById(req, res) {
  const { code, body } = await db.deleteTodoById(req.params.id);
  res.status(code).json(body);
}

async function handleUpadateEntryById(req, res){
  const { code, body } = await db.updateTodo(req.params.id, req.body);
  res.status(code).json(body);
}

module.exports = {
  handleCreateEntry,
  handleGetEntryById,
  handleGetEntries,
  handleDeleteEntryById,
  handleUpadateEntryById
};
