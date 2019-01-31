const postData = function() {
  const data = {};
  const url = "/homepage";
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(data => {
      console.log("json data", data);
    }); // parses response to JSON
};

window.onload = postData;
