var express = require("express")
var routes = express.Router() //essa var routes vai ser responsável pelas rotas do site
var instructors = require("./app/controllers/instructors")
var members = require("./app/controllers/members")

routes.get('/', function( req , res){ //rota da página inicial
    return res.redirect("/instructors")
})
routes.get('/instructors', instructors.index)
routes.get('/instructors/create', instructors.create) //rota para a página de entrada de novo instrutor
routes.get('/instructors/:id', instructors.show)//rota que vai mostrar o instrutor cadastrado de acordo com id
routes.get('/instructors/:id/edit', instructors.edit)//rota da página de edição do instrutor
routes.post('/instructors', instructors.post)

// VERBOS HTPP
// GET : RECEBER ALGUMA COISA - esse alguma coisa se chama RESOURCE, que por enquanto é o instructors
// POST: SALVAR OU CRIAR ALGUMA COISA - cria um novo RESOURCE com dados enviados
// PUT: ATUALIZAR ALGUMA COISA - atualiza o RESOURCE
// DELETE: DELETAR ALGUMA COISA - deletar um RESOURCE

routes.put("/instructors", instructors.put)/*método que irá atualizar os dados dos instrutores
na página de edição, salvando e atualizando os dados no arquivo data.json*/
routes.delete("/instructors", instructors.delete)/*esse método vai possibilitar que o instrutor
seja deletado do arquivos data.json*/


routes.get('/members', members.index)
routes.get('/members/create', members.create)
routes.get('/members/:id', members.show)//rota que vai mostrar o instrutor cadastrado de acordo com id
routes.get('/members/:id/edit', members.edit)//rota da página de edição do instrutor
routes.post('/members', members.post)
routes.put("/members", members.put)/*método que irá atualizar os dados dos instrutores
na página de edição, salvando e atualizando os dados no arquivo data.json*/
routes.delete("/members", members.delete)/*esse método vai possibilitar que o instrutor
seja deletado do arquivos data.json*/

module.exports = routes // comando para exportar as rotas do site