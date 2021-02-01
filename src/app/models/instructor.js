/* lembrando que all(callback é a mesa coisa que all: function (callback){}) */

var {age , date} = require('../../lib/utils')
var db = require('../../config/db')

module.exports = {
    all(callback){ //será resposável por chamar  todos os instrutores index
        db.query(`
            SELECT instructors.*, count(members) AS total_students 
            FROM instructors
            LEFT JOIN members ON (instructors.id = members.instructor_id)
            GROUP BY instructors.id
            ORDER BY total_students DESC`, function(err , results){
            if(err){ throw `Database Error ! ${err}`}
                callback(results.rows)
    })   /* esse order by name asc serve para ordenar pelo nome ascendte ordem alfabetica
    ja desc é descentende */ 
    },

    create( data, callback){
        var query =  `
            INSERT INTO instructors (
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
        `
        var values = /*essa var terá os valores que substituiram os valores em $1 etc*/[
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,//vai puxar do ultils a forma de data dia mes ano
            date(Date.now()).iso,
        ]
        
        db.query(query, values, function(err , results){
            if(err){ throw `Database Error ! ${err}`}
                callback(results.rows[0])
        })
    },

    find(id , callback){//esa função vai buscar um instrutor apenas, página show
        db.query(`
            SELECT * 
            FROM instructors 
            WHERE id = $1`, [id], function(err , results){
                if(err){ throw `Database Error ! ${err}`}
                callback(results.rows[0])
        })
    },

    findby(filter , callback){//função para filtar na tabela por nome do instrutor
        db.query(`
            SELECT instructors.*, count(members) AS total_students 
            FROM instructors
            LEFT JOIN members ON (instructors.id = members.instructor_id)
            WHERE instructors.name ILIKE '%${filter}%' 
            OR instructors.services ILIKE '%${filter}%'
            GROUP BY instructors.id
            ORDER BY total_students DESC`, function(err , results){
            if(err){ throw `Database Error ! ${err}`}
                callback(results.rows)
    } /*esse where vai filtrar por nome do instrutor
    ILIKE quer dixer que pode ser letra maiuscula ou minuscula
    a % antes e depois da template string quer dizer que vai procurar tudo
    que for digitado no input. O OR ou AND adiciona mais condições, sendo and o e e or e ou*/
    )},

    update(data , callback){
        var query = `
            UPDATE instructors SET
                avatar_url = ($1),
                name = ($2),
                birth = ($3),
                gender = ($4),
                services = ($5)
            WHERE id = $6
        `
        var values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.gender,
            data.services,
            data.id
        ]

        db.query(query, values, function (err , results){
            if(err){ throw `Database Error! ${err}`}
                callback()
        })
    },

    delete(id , callback){
        db.query(`DELETE FROM instructors WHERE id = $1`, [id], function(err , results){
            if(err){ throw `Database Error ! ${err}`}
            return callback()
        })
    },

    paginate(params){
        var { filter, limit, offset, callback } = params

        let query = ""
        let filter_query = ""
        let total_query = `(
            SELECT count(*) FROM instructors
        ) AS total` 
        
        if (filter) { 

            filter_query = `
            WHERE instructors.name ILIKE '%${filter}%'
            OR instructors.services ILIKE '%${filter}%'
            `

            total_query = `(
                SELECT count(*) FROM instructors
                ${filter_query}
            ) AS total`
        }

        query = `
        SELECT instructors.*, ${total_query},
        count(members) AS total_students
        FROM instructors
        LEFT JOIN members ON (instructors.id = members.instructor_id)
        ${filter_query}
        GROUP BY instructors.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err , results){
            if(err){ throw `Database Error! ${err}`}

            callback(results.rows)
        })
    }
} 