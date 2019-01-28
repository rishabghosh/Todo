class User {
  constructor(name, username, password) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.todo = [];
  }

  getName() {
    return this.name;
  }
  getUsername() {
    return this.username;
  }
  isValidPassword(password) {
    return this.password === password;
  }
  addTodoList(todo){
    this.todo.push(todo);
  }
  getTodoList() {
    return this.todo;
  }
}

module.exports = User;
