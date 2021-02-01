
var {age , date} = require('../../lib/utils')
var Instructor = require('../models/instructor')

module.exports = {
    index(req , res){// é uma maneira reduzida de escrever index: function (req, res){}
        let { filter, page, limit} = req.query //page é a página que estou e limite o número de elementos que aparecerá por página
        
        page = page || 1 // se page não existir vai ficar um (page = a page ou 1)
        limit = limit || 2 // limite de elementos por página(se não houver número de elementos ele será de 2 por página)
        let offset = limit * (page -1)
        
        /* offset é a posição do array que vai começar a
        mostrar na página. Se tiver 2 elementos a página 1 vai começar no elemento 0 e 1, página
        2 do elemento 2, 3 e assim por diante.
        
        O limit = 2. 2 vezes a página atual menos 1 é o offset
        assim: quando a página for 1, o offset vai ser 2x 1-1 = 0(vai começar da posição zero)
        página for 2 = 2 x 2-1 = 2x1 = 2(vai começar da posição 2) e assim por diante conforme aumente
        o número de páginas*/

        var params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors){

                const pagination = { 
                    total: Math.ceil(instructors[0].total / limit), /* math ceil sempre
                    arredonda para cima o resultado de uma conta. Nesse caso vamos fazer o
                    total de instrutores começando da posição zero, dividido pelo limite de
                    instrutores que deixamos por página, nesse caso 2. Se fosse 3/2 iria dar 1.5
                    para que não de problema usamos o ceil para ficar em 2 páginas */
                    page
                }

                return res.render("instructors/index" , {instructors , pagination , filter})
            }
        }

        Instructor.paginate(params)

    },
    
    create(req , res){
        return res.render('instructors/create')
    },

    post(req , res){

        var keys = Object.keys(req.body) 
        for( key of keys){
            if(req.body[key]== ""){
                return res.send("Por favor, preencha todos os campos!")
            }
        }
        Instructor.create(req.body, function(instructor){
            return res.redirect(`/instructors/${instructor.id}`)
        })
    },

    show(req , res){
        Instructor.find(req.params.id, function(instructor){
            if(!instructor){ return res.send('Instrutor não encontrado!')}

                instructor.age = age(instructor.birth)
                instructor.services = instructor.services.split(",")
                instructor.created_at = date(instructor.created_at).format
            
                    return res.render("instructors/show", {instructor})
        })

    },
    
    edit(req , res){
        Instructor.find(req.params.id, function(instructor){
            if(!instructor){ return res.send('Instrutor não encontrado!')}
            
                instructor.birth = date(instructor.birth).iso
                    return res.render("instructors/edit", {instructor})
        })

    },

    put(req , res){
        var keys = Object.keys(req.body) 
            for( key of keys){
                if(req.body[key]== ""){
                    return res.send("Por favor, preencha todos os campos!")
            }
        }

        Instructor.update(req.body, function(){
            return res.redirect(`/instructors/${req.body.id}`)
        })

    },

    delete(req , res){
        Instructor.delete(req.body.id, function(){
            return res.redirect(`/instructors`)
        })

    },
}
