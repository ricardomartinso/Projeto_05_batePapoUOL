
const inputText = document.querySelector("#escreva-aqui"); //.value pega o texto digitado
let chat = document.querySelector(".chat");
const botaoEnviar = document.querySelector(".navbar-bottom ion-icon");
let ultimaMensagem;
let perguntarNome;
let nome;
let participantes;
let mensagemUsuario = {
    from: perguntarNome,
    to: "Todos",
    text: inputText.value,
    type: "message"
};
let sidebar = document.querySelector(".sidebar");

perguntarUser();
setInterval(checarUsuarioOnline, 4000);
setInterval(buscarMensagens,5000);
setInterval(buscarParticipantes,10000);


function perguntarUser() {
    perguntarNome = prompt("Qual o seu usuário?");
    nome = {
        name: perguntarNome
    };

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
    promise.then(usuarioValido);
    promise.catch(usuarioInvalido);

}
function buscarMensagens(){
    console.log("atualizou as mensagens");
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(function(resposta) {
    let mensagemServidor = resposta.data;
    
    chat.innerHTML = "";
    
    for(let i = 0; i < mensagemServidor.length; i++) {
    if (mensagemServidor[i].type === 'status') {
        chat.innerHTML += 
    `<div class="mensagem status">

    <p><span class="horario">(${mensagemServidor[i].time})</span>

    <strong class="username" onclick="selecionarUsuarioMain(this)">${mensagemServidor[i].from}</strong>
    <span class="texto" style="margin-left:0;">${mensagemServidor[i].text}</span></p>

</div>
`
    } else if (mensagemServidor[i].type === "message") {
    chat.innerHTML += 
    `<div class="mensagem message">

    <p><span class="horario">(${mensagemServidor[i].time})</span>

    <strong class="username" onclick="selecionarUsuarioMain(this)">${mensagemServidor[i].from}</strong> 

    para 

    <strong class="to">${mensagemServidor[i].to}</strong>:

    <span class="texto">${mensagemServidor[i].text}</span></p>

</div>
`
} else if (mensagemServidor[i].type === "private_message" && mensagemServidor[i].to === mensagemServidor[i].from) {
    chat.innerHTML += 
    `<div class="mensagem private_message">

    <p><span class="horario">(${mensagemServidor[i].time})</span>

    <strong class="username" onclick="selecionarUsuarioMain(this)">${mensagemServidor[i].from}</strong> 

    para 

    <strong class="to">${mensagemServidor[i].to}</strong>:

    <span class="texto">${mensagemServidor[i].text}</span></p>

</div>
`
}

}
    buscarParticipantes();
    ultimaMensagem = document.querySelectorAll(".mensagem");
    ultimaMensagem[ultimaMensagem.length - 1].scrollIntoView();
   })

   promessa.catch(function(){alert("n funfou");})

}
function enviarMensagemPost() {

    if (mensagemUsuario.to === "Todos") {
        mensagemUsuario = {
            from: perguntarNome,
            to: "Todos",
            text: inputText.value,
            type: "message"
        }
    } else if (mensagemUsuario.to !== "Todos" && mensagemUsuario.to !== perguntarNome) {
        mensagemUsuario = {
            from: perguntarNome,
            to: mensagemUsuario.to,
            text: inputText.value,
            type: "message"
        }
    } else if (mensagemUsuario.to === perguntarNome) {
        mensagemUsuario = {
            from: perguntarNome,
            to: mensagemUsuario.to,
            text: inputText.value,
            type: "private_message"
        }
    }
    inputText.value = "";
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemUsuario);
    promessa.then(buscarMensagens);
    promessa.catch(function(){
        window.location.reload();
    })
}

function checarUsuarioOnline(response) {
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome);
}
function usuarioValido() {
    console.log("Login efetuado com sucesso.");
    buscarMensagens();
    buscarParticipantes();
}
function usuarioInvalido(error) {
    if (error.response.status === 400) {
        alert("Nome de usuário já existente");
        perguntarUser();
    }
}

inputText.addEventListener("keyup", digitarEnter);

function digitarEnter(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      botaoEnviar.click();
    }
}

function abrirSidebar() {
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.remove("hidden");
}

function fecharSidebar() {
    
    sidebar.classList.add("hidden")
}

function buscarParticipantes() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(renderizarParticipantes);
}
function renderizarParticipantes(resposta) {
    let usuarios = document.querySelector(".usuarios");
    participantes = resposta.data;
    usuarios.innerHTML = `<p onclick="selecionarUsuarioSidebar(this)"><ion-icon name="person-circle" style="margin-right: 5px;"></ion-icon><span class="username">Todos</span></p>`
    for(let i = 0; i < participantes.length; i++) {
    
    usuarios.innerHTML += `<p onclick="selecionarUsuarioSidebar(this)"><ion-icon name="person-circle" style="margin-right: 5px;"></ion-icon><span class="username">${participantes[i].name}</span></p>`
    }
    console.log("atualizou participantes");
}
function selecionarUsuarioSidebar(user) {
    
    mensagemUsuario.to = user.querySelector(".username").innerHTML;
    sidebar.classList.add("hidden");
}
function selecionarUsuarioMain(user) {
    mensagemUsuario.to = user.innerHTML;
}