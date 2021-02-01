
//ADICIONANDO CLASSE ACTIVE NO HEADER
var current_page = window.location.pathname /*esse método pathname indica em que página estou
 que nesse caso pode ser /members ou /instructors por exemplo*/

var menu_items = window.document.querySelectorAll("header .links a")/* selecionei todos
as tags a do header que são o instrutores e os membros */

for( item of menu_items){
    if(current_page.includes(item.getAttribute("href"))){/*se a página atual for igual ao meu href*/
        item.classList.add("active")
    }
}

//CRIANDO JANELA DE CONFIRMAÇÃO ANTES DE DELETAR

/*var formDelete = document.getElementById("del")

formDelete.addEventListener("submit" , function(event){
    let confirmation = confirm(" Deseja deletar ? ")

    if(!confirmation){
        event.preventDefault()
    }
})*/

//PAGINAÇÃO
//total pages = 20
//selectedPage = 6
// [1, ..., 4, 5, 6, 7, 8 ..., 20]
//selectedPage = 5
// [1, 2, 3, 4, 5, 6, 7, ..., 20]
//selectedPage = 15
// [1, ..., 13, 14, 15, 16, 17, ..., 20]

function paginate(selected_page , total_pages){

    let pages = []
    let old_page 

    for(let current_page = 1; current_page <= total_pages; current_page++){

        const first_and_last_page = current_page == 1 || current_page == total_pages// página selecionada for igual a 1 ou a 20
        const pages_after_selected_page = current_page <= selected_page + 2//página atual vai ser menor ou igual a página selecionada +2. vai aparecer mais 2 (15,16,17)
        const pages_before_selected_page = current_page >= selected_page - 2// página atual é menor ou igual a página selecionada menos 2. vai aparecer (13,14,15)

            if(first_and_last_page || pages_before_selected_page && pages_after_selected_page){
                if(old_page && current_page - old_page > 2){
                    pages.push("...")
        }

            if(old_page && current_page - old_page == 2){
                pages.push(old_page + 1)
        }

        pages.push(current_page) /* vai imprimir na tela [1, 13, 14, 15, 16, 17, 20] */
        old_page = current_page
        }
    }
        return pages
}

function create_pagination(pagination){
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page //+ transforma em number
    const total = +pagination.dataset.total
    const pages = paginate( page, total)
    
    let elements = ""
    
    for (let page of pages){
        if(String(page).includes("...")){
            elements += `<span>${page}</span>`
        } else {
            if(filter){
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
            
        }
    }
    
    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if(pagination){
    create_pagination(pagination)
}



