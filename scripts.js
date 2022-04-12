let inputText = document.querySelector("#escreva-aqui"); //.value pega o texto digitado
let chat = document.querySelector(".chat");
let ultimaMensagem = document.querySelector(".mensagem:last-child");

function enviarMensagem() {
    
    ultimaMensagem.scrollIntoView(); //Scrolla para ultima mensagem

    chat.innerHTML += `<div class="mensagem">
                            <p><span class="horario">(09:22:10) </span><strong>João</strong> para <strong>Todos</strong>: ${inputText.value}</p>
                        </div>
`
    
}