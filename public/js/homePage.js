const updateList = function() {
  const list = document.getElementById("title").value;
  console.log(list);
  fetch("/todoList", {
    method: "POST",
    body: list
  })
    .then(res => res.text())
    .then(lists => {
      let listsTableDiv = document.getElementById("todo_table");
      console.log(lists);
      listsTableDiv.innerHTML = lists;
    });
  document.getElementById("title").value = "";
};

const updateItems = function() {
  const list = document.getElementById("title").value;
  if (list) {
    console.log(list);
    let URL = document.URL.split("/");
    let urlLength = URL.length;
    let listId = URL[urlLength - 1];
    fetch("/todoItems", {
      method: "POST",
      body: `${list},${listId}`
    })
      .then(res => res.text())
      .then(lists => {
        let listsTableDiv = document.getElementById("todo_table");
        console.log(lists);
        listsTableDiv.innerHTML = lists;
      });
    document.getElementById("title").value = "";
  }
};
