const mariadb = require('mariadb');
const { mapUpdateBodyToSQL } = require("../utils/mapper");

//Klasse als Singelton
let c;

module.exports = class Connector{
  constructor(){
    this.pool = null;
    this.connection = null;
    this.TABLENAME = 'todos'
  }

  static of(){
    if(c)
      return c
    else
      c = new Connector();
      return c;    
  }

  async connect(dbhost, password, database){
    this.pool = mariadb.createPool({
      host: dbhost, user: 'root', connectionLimit: 5, password, database,
    });
    this.connection = await this.pool.getConnection();

    const tables = await this.connection.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")

    if(!tables.find(e => e.TABLE_NAME === "todos")){
      const result = await this.connection.query("CREATE TABLE todos (id INTEGER PRIMARY KEY AUTO_INCREMENT, title nvarchar(255), description nvarchar(1024), duedate date, done bit)")
      .catch(console.log)
    }
  }

  async getTodoById(id) {
    const result = await this.connection.query(`SELECT * from ${this.TABLENAME} WHERE id=${id}`);
    if (result.length === 1) return { code: 200, body: result[0] };
  
    return { code: 404, body: { code: 404, message: `todo with id ${id} not found!` } };
  }

  async createTodo({ title, description, duedate }) {
    const query = `INSERT INTO todos (title, description, duedate, done) VALUES ("${title}", "${description}", "${duedate}", 0)`;
    const  {affectedRows, insertId} = await this.connection.query(query);
  
    if (affectedRows === 1) {
      return {code: 201, body: { id: insertId.toString(), title, description, duedate }}
    } else {
      return {code: 500, body: { status: 500, message: 'unexpected error!' }};
    }
  }

  async deleteTodoById(id) {
    const  {affectedRows} = await this.connection.query(`DELETE from ${this.TABLENAME} WHERE id=${id}`);
  
    if (affectedRows === 1) {
      return {code: 200, body: { status: 200, message: 'deleted!' }};
    } else {
      return {code: 500, body: { status: 500, message: 'unexpected error!' }};
    }
  }

  async getTodos() {
    const result = await this.connection.query(`SELECT * from ${this.TABLENAME}`);

    if (result) return { code: 200, body: result };
  
    return { code: 500, body: { code: 500, message: `unexpected error!` } };
  }

  async updateTodo(id, body){
    const updateStatement = mapUpdateBodyToSQL(body);
    const {affectedRows} = await this.connection.query(`UPDATE ${this.TABLENAME} ${updateStatement} WHERE id=${id}`);

    if (affectedRows === 1) {
      return {code: 200, body: { status: 200, message: 'update!' }};
    } else {
      return {code: 500, body: { status: 500, message: 'unexpected error!' }};
    }
  }

}
