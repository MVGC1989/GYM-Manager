/* lembrando que all(callback é a mesa coisa que all: function all(callback){}) */

var {date} = require('../../lib/utils')
var db = require('../../config/db')

module.exports = {
    all(callback){ //será resposável por chamar  todos os instrutores index
        db.query(`SELECT * FROM members`, function(err , results){
            if(err){ throw `Database Error ! ${err}`}
                callback(results.rows)
        })    
    },

    create( data, callback){
        var query =  `
            INSERT INTO members (
                name,
                avatar_url,
                gender,
                email,
                birth,
                blood,
                weight,
                height,
                instructor_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 )
                RETURNING id
        `
        var values = /*essa var terá os valores que substituiram os valores em $1 etc*/[
            data.name,
            data.avatar_url,
            data.gender,
            data.email,
            date(data.birth).iso,//vai puxar do ultils a forma de data dia mes ano
            data.blood,
            data.weight,
            data.height,
            data.instructor
        ]
        
        db.query(query, values, function(err , results){
            if(err){ throw `Database Error ! ${err}`}
                callback(results.rows[0])
        })
    },

    find(id , callback){//esa função vai buscar um instrutor apenas, página show
        db.query(`
            SELECT members.*, instructors.name AS instructor_name
            FROM members 
            LEFT JOIN instructors ON (members.instructor_id = instructors.id)
            WHERE members.id = $1`, [id], function(err , results){
                if(err){ throw `Database Error ! ${err}`}
                callback(results.rows[0])
        })
    },

    update(data , callback){
        var query = `
            UPDATE members SET
                avatar_url = ($1),
                name = ($2),
                birth = ($3),
                gender = ($4),
                email = ($5),
                blood = ($6),
                weight = ($7),
                height = ($8),
                instructor_id = ($9)
            WHERE id = $10
        `
        var values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.gender,
            data.email,
            data.blood,
            data.weight,
            data.height,
            data.instructor,
            data.id
        ]

        db.query(query, values, function (err , results){
            if(err){ throw `Database Error! ${err}`}
                callback()
        })
    },

    delete(id , callback){
        db.query(`DELETE FROM members WHERE id = $1`, [id], function(err , results){
            if(err){ throw `Database Error ! ${err}`}
            return callback()
        })
    },

    instructors_select_options(callback){//aqui vou selecionar o nome dos instrutores para escolher no campo de preenchimento do novo aluno
        db.query(`SELECT name, id FROM instructors`, function(err , results){
            if(err){ throw `Database error! ${err}`}
                callback(results.rows)
        })
    },

    paginate(params){
        var { filter, limit, offset, callback } = params

        let query = ""
        let filter_query = ""
        let total_query = `(
            SELECT count(*) FROM members
        ) AS total` 
        
        if (filter) { 

            filter_query = `
            WHERE members.name ILIKE '%${filter}%'
            OR members.email ILIKE '%${filter}%'
            `

            total_query = `(
                SELECT count(*) FROM members
                ${filter_query}
            ) AS total`
        }

        query = `
        SELECT members.*, ${total_query}
        FROM members
        ${filter_query}
        LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err , results){
            if(err){ throw `Database Error! ${err}`}

            callback(results.rows)
        })
    }
} 