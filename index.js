const fs = require("fs");
const http = require("http");
const url = require("url");
////////////////////////// FILES
// Reading from files (BLOCKING CODE)
// const fileTxt = fs.readFileSync("./exercise/exercise1.txt", "utf-8");
// const fileTxt2 = `This is the file we have written right now ${Date.now()}`;

// // Writing in files
// fs.writeFileSync("./exercise/exercise2.txt", fileTxt2);
// console.log("File done 😊");

////////////////////////////////
// NON BLOCKING CODE

// fs.readFile("./exercise/exercise1.txt", "utf-8", (err, text) => {
//   if (err) {
//     console.log("Can't read file");
//   } else {
//     console.log(text);
//   }
// });
// console.log("Function is still executing");

////////////////////////// SERVER

const newTemplate = (template, data) => {
  let outputTemplate = template.replace("#personName#", data.name);
  outputTemplate = outputTemplate.replace(
    "#personDescription#",
    data.description
  );
  outputTemplate = outputTemplate.replace("#ID#", data.id);
  outputTemplate = outputTemplate.replace("#image#", data.image);

  return outputTemplate;
};

const appTemplate = fs.readFileSync("./templates/app.html", "utf-8");
const data = fs.readFileSync("./data/data.json", "utf-8");
const profileTemplate = fs.readFileSync("./templates/profile.html", "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const newUrl = url.parse(req.url, true);
  console.log(newUrl);
  ///// API
  if (newUrl.pathname === "/app" || newUrl.pathname === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const newHtml = dataObj
      .map((item) => newTemplate(appTemplate, item))
      .join("");

    res.end(newHtml);
  } else if (newUrl.pathname === "/profile") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const profile = dataObj[newUrl.query.id];
    const newHtml = newTemplate(profileTemplate, profile);
    res.end(newHtml);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(9000, "localhost", () => {
  console.log("Server is running");
});
