const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
const listaDeTarefasUl = document.querySelector('.app__section-task-list');
const novaTarefaBt = document.querySelector('.app__button--add-task');
const removerConcluidasBt = document.querySelector('#btn-remover-concluidas');
const removerTodasTarefasBt = document.querySelector('#btn-remover-todas');
const formulario = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas(){
    localStorage.setItem('tarefas',JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa){
    const li =document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
     </svg>
    `

    const paragrafo = document.createElement('p')
    paragrafo.classList.add('app__section-task-list-item-description')
    paragrafo.textContent = tarefa.descricao

    const botao = document.createElement('button')
    const imagemBotao = document.createElement('img')

    botao.onclick = () =>{
        const novaDescricao = prompt("qual o novo nome da tarefa ?")
        if(novaDescricao){
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao 
            atualizarTarefas()
        }
    }
    
    botao.classList.add('app_button-edit')
    imagemBotao.setAttribute('src','/imagens/edit.png')

    botao.append(imagemBotao)

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled','disabled')
    }else{
        li.onclick = () =>{
            document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(elemento =>{
                elemento.classList.remove('app__section-task-list-item-active')
            })
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            li.classList.add('app__section-task-list-item-active')
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
        }
    }
    

    return li
}

novaTarefaBt.addEventListener('click', () =>{
    formulario.classList.toggle('hidden');
})

formulario.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    };

    tarefas.push(tarefa)
    const elemento = criarElementoTarefa(tarefa)
    listaDeTarefasUl.append(elemento)
    formulario.classList.add('hidden')
    textArea.value = ''
    atualizarTarefas()
})

tarefas.forEach(tarefa => {
    const elemento = criarElementoTarefa(tarefa)
    listaDeTarefasUl.append(elemento)
});

document.addEventListener('focoFinalizado',() =>{
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled','disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete':'.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })

    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

removerConcluidasBt.onclick = () => removerTarefas(true)

removerTodasTarefasBt.onclick = () => removerTarefas(false)