
var {date} = require('../../lib/utils')
var Member = require('../models/member')

module.exports = {
    index(req , res){
    
    let { filter, page, limit} = req.query 
        
    page = page || 1 
    limit = limit || 2 
    let offset = limit * (page -1)

    var params = {
        filter,
        page,
        limit,
        offset,
        callback(members){

            const pagination = { 
                total: Math.ceil(members[0].total / limit), 
                page
            }
            return res.render("members/index" , {members , pagination , filter})
        }
    }

    Member.paginate(params)

},
    
    create(req , res){
        Member.instructors_select_options(function(options){
            return res.render('members/create' , {instructor_options: options})
        })
    },

    post(req , res){
        var keys = Object.keys(req.body) 
        for( key of keys){
            if(req.body[key]== ""){
                return res.send("Por favor, preencha todos os campos!")
            }
        }
        Member.create(req.body, function(member){
            return res.redirect(`/members/${member.id}`)
        })
    },

    show(req , res){
        Member.find(req.params.id, function(member){
            if(!member){ return res.send('Instrutor não encontrado!')}
                member.birth = date(member.birth).birth_day            
                    return res.render("members/show", {member})
        })
    },
    
    edit(req , res){
        Member.find(req.params.id, function(member){
            if(!member){ return res.send('Membro não encontrado!')}
            
                member.birth = date(member.birth).iso
                Member.instructors_select_options(function(options){
                    return res.render('members/edit', {member , instructor_options:options})
                })  
        })

    },

    put(req , res){
        var keys = Object.keys(req.body) 
            for( key of keys){
                if(req.body[key]== ""){
                    return res.send("Por favor, preencha todos os campos!")
            }
        }

        Member.update(req.body, function(){
            return res.redirect(`/members/${req.body.id}`)
        })

    },

    delete(req , res){
        Member.delete(req.body.id, function(){
            return res.redirect(`/members`)
        })

    },
}
