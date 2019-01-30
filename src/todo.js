class Todo {
  constructor(todoDetails) {
    this.title = todoDetails.title;
    this.description = todoDetails.description;
    this.item = todoDetails.item;
  }

  editTitle(newTitle) {
    this.title = newTitle;
  }
  
  addItems(newItem) {
    this.item.push(newItem);
  }
}

module.exports = Todo;
