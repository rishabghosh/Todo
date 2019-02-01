const updateList = function() {
  const list = document.getElementById("title").value;
  console.log(list);
  fetch("/getTodoList", {
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
