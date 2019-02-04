const updateList = function() {
  const list = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  fetch("/todoList", {
    method: "POST",
    body: JSON.stringify({ list, description })
  })
    .then(res => res.text())
    .then(lists => {
      let listsTableDiv = document.getElementById("todo_table");
      listsTableDiv.innerHTML = lists;
    });
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
};

const updateItems = function() {
  const list = document.getElementById("title").value;
  if (list) {
    let URL = document.URL.split("/");
    let urlLength = URL.length;
    let listId = URL[urlLength - 1];
    fetch("/todoItems", {
      method: "POST",
      body: JSON.stringify({ list, listId })
    })
      .then(res => res.text())
      .then(lists => {
        let listsTableDiv = document.getElementById("todo_table");
        listsTableDiv.innerHTML = lists;
      });
    document.getElementById("title").value = "";
  }
};
