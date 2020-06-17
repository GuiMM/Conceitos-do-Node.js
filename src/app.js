const express = require("express");
const cors = require("cors");

 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function ValidateIdExist(request, response, next){
  const {id} = request.params;
  const repository = repositories.find(x=> x.id == id);

  if(repository)
    return next()
  else  
    return response.status(400).json();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = { 
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", ValidateIdExist, (request, response) => {
  const {id} = request.params;  
  const {title, url, techs} = request.body;

  const index = repositories.findIndex(x=> x.id == id);
  const likes = repositories[index].likes
  const newRepo = {
    id,
    title,
    url,
    techs,
    likes
  }
  repositories[index] = newRepo;
  return response.json(newRepo);
});

app.delete("/repositories/:id",ValidateIdExist, (request, response) => {
  const {id} = request.params;
  const index = repositories.findIndex(x=> x.id == id);

  repositories.splice(index,1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", ValidateIdExist, (request, response) => {
  const {id} = request.params;
  const repository = repositories.find(x=> x.id == id);
  repository.likes++;

  return response.status(200).json(repository); 
});

module.exports = app;
