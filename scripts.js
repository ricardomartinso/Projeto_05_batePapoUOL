
let inputText = document.querySelector("#escreva-aqui"); //.value pega o texto digitado
let chat = document.querySelector(".chat");
let ultimaMensagem;
let perguntarNome;

perguntarUser();
//setInterval(checarUsuarioOnline, 5000);

function perguntarUser() {
    perguntarNome = prompt("Qual o seu usuário?");
    let nome = {
        name: perguntarNome
    };

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
    promise.then(usuarioValido);
    promise.catch(usuarioInvalido);

}
function buscarMensagens(){
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    
    promessa.then(function(resposta) {
    let mensagemServidor = resposta.data;
    
    
    for(let i = 0; i < mensagemServidor.length; i++) {
    if (mensagemServidor[i].type === 'status') {
        chat.innerHTML += 
    `<div class="mensagem ${mensagemServidor[i].type}">

    <p><span class="horario">(${mensagemServidor[i].time})</span>

    <strong class="nome">${mensagemServidor[i].from}</strong>
    <span class="texto" style="margin-left:0;">${mensagemServidor[i].text}</span></p>

</div>
`
    } else {
    chat.innerHTML += 
    `<div class="mensagem ${mensagemServidor[i].type}">

    <p><span class="horario">(${mensagemServidor[i].time})</span>

    <strong class="nome">${mensagemServidor[i].from}</strong> 

    para 

    <strong class="to">${mensagemServidor[i].to}</strong>:

    <span class="texto">${mensagemServidor[i].text}</span></p>

</div>
`
}

}
    ultimaMensagem = document.querySelectorAll(".mensagem");
    ultimaMensagem[ultimaMensagem.length - 1].scrollIntoView();
   })

   promessa.catch(function(){alert("n funfou");})

}
function enviarMensagemPost() {

    let mensagemUsuario = {
        from: perguntarNome,
        to: "Todos",
        text: inputText.value,
        type: "message"
    }

    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemUsuario);
    promessa.then(buscarMensagens);
}

function checarUsuarioOnline() {
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", perguntarNome);

}
function usuarioValido() {
    console.log("login realizado com sucesso");
    buscarMensagens();
}
function usuarioInvalido(error) {
    if (error.response.status === 400) {
        alert("Nome de usuário já existente");
        perguntarUser();
    }
}
setInterval(buscarMensagens,3000);