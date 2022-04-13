let inputText = document.querySelector("#escreva-aqui"); //.value pega o texto digitado
let chat = document.querySelector(".chat");
let ultimaMensagem = document.querySelector(".mensagem:last-child");
let perguntarNome;

perguntarUser();
// setInterval(checarUsuarioOnline, 5000);
buscarMensagens();
function enviarMensagem() {
    
    ultimaMensagem.scrollIntoView(); //Scrolla para ultima mensagem

    chat.innerHTML += `<div class="mensagem">
    <p><span class="horario">(09:22:10) </span><strong>${perguntarNome}</strong> para <strong>Todos</strong>: ${inputText.value}</p>
</div>
`   
}
function perguntarUser() {
    perguntarNome = prompt("Qual o seu usuário?");
    let nome = {
        name: perguntarNome
    };

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
    promise.then(usuarioValido);
    promise.catch(usuarioInvalido);

}
function checarUsuarioOnline() {
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", perguntarNome);
    promise.then(function(){alert("user on")})
    promise.catch(function(){alert("user off")})

}
function usuarioValido() {
    alert("Bem vindo ao bate papo Uol");
}
function usuarioInvalido(error) {
    if (error.response.status === 400) {
        alert("Nome de usuário já existente");
        perguntarUser();
    }
}
function buscarMensagens(response){
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

   promessa.then(function() {
       console.log(promessa);
   })
   promessa.catch(function(){
       alert("n funfou");
   })
}

