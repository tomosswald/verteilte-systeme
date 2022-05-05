const joi = require('joi');

const todoSchema = joi.object({
  title: joi.string().max(255).required(),
  description: joi.string().max(1024).required(),
  duedate: joi.string().regex(/[0-9]{4}-[0-1][0-9]-[0-3][0-9]/).required(), // yyyy-mm-dd
});

const todoUpdateSchema = joi.object({
  title: joi.string().max(255),
  description: joi.string().max(1024),
  duedate: joi.string().regex(/[0-9]{4}-[0-1][0-9]-[0-3][0-9]/),
  done: joi.boolean()
}).min(1);

const todoId = joi.number().required();

async function validateTodoSchema(req, res, next) {
  todoSchema.validateAsync(req.body).then(() => next()).catch(() => {
    res.status(400).json({ code: 400, message: 'invalid request body' });
  });
}

async function validateTodoId(req, res, next) {
  todoId.validateAsync(req.params.id).then(() => next()).catch(() => {
    res.status(400).json({ code: 400, message: 'invalid id' });
  });
}

async function validateUpdateTodoSchema(req, res, next){
  todoUpdateSchema.validateAsync(req.body).then(()=>next()).catch((err)=>{
    res.status(400).json({ code: 400, message: 'at least one parameter is required' });
  })
}

module.exports = {
  validateTodoSchema,
  validateTodoId,
  validateUpdateTodoSchema,
};
