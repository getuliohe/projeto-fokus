const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botao = document.querySelectorAll('.app__card-button');
const musicaInput = document.querySelector('#alternar-musica');
const startPauseBt = document.querySelector('#start-pause');
const comecarOuPausarBt = document.querySelector('#start-pause span');
const comecarOuPausarImg = document.querySelector('#start-pause img');
const temporizadorDiv = document.querySelector('#timer');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioBeep = new Audio('/sons/beep.mp3');

let tempoDecorrido = 10;
let intervaloId = null;

musica.loop = true;

musicaInput.addEventListener('change',() =>{
    if (musica.paused){
        musica.play();
    }else{
        musica.pause();
    }
})

function alterarContexto(contexto){
    botao.forEach(function(element){
        element.classList.remove('active')
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src',`./imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
            tempoDecorrido = 10;
            mostrarTempo();
            break;
        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            tempoDecorrido = 300;
            mostrarTempo();
            break;
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            tempoDecorrido = 900;
            mostrarTempo();
            break;
        default:
            break;
    }
}

focoBt.addEventListener('click',() =>{
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click',() =>{
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click',() =>{
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})

const contagemRegressiva = () =>{
    mostrarTempo();
    if (tempoDecorrido<=0){
        zerar()
        audioBeep.play()
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo){
            const evento = new CustomEvent('focoFinalizado')
            document.dispatchEvent(evento)
        }
        return;
    }
    tempoDecorrido -= 1;
}

startPauseBt.addEventListener('click',iniciarOuPausar);

function iniciarOuPausar(){
    if(intervaloId){
        audioPause.play();
        zerar();
        return;
    }
    audioPlay.play()
    intervaloId = setInterval(contagemRegressiva,1000);
    comecarOuPausarBt.textContent = 'Pausar';
    comecarOuPausarImg.setAttribute('src','./imagens/pause.png');
}

function zerar(){
    clearInterval(intervaloId)
    intervaloId = null
    comecarOuPausarBt.textContent = 'Começar';
    comecarOuPausarImg.setAttribute('src','./imagens/play_arrow.png');
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorrido * 1000);
    const tempoMinutos = tempo.toLocaleTimeString('pt-br',{minute:'2-digit',second:'2-digit'});
    temporizadorDiv.innerHTML = `${tempoMinutos}`
}

mostrarTempo();

