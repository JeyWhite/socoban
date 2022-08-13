const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;
const fs = require("fs");
const server = http.createServer((req, res) => {
  console.log(req)
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});




function getLevel(num){
  let fileContent
  fs.readFile(`levels/${num}.json`, "utf8", function(error,data){
    if(error) throw error; // если возникла ошибка
    fileContent = data;  // выводим считанные данные
  });
  return(fileContent)
}