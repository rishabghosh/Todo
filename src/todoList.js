class TodoList {
  constructor(title, description = "", item = []) {
    this.title = title;
    this.description = description;
    this.item = item;
  }
}

module.exports = TodoList;