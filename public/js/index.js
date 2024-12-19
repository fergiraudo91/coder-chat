const socket = io();

let userName;

Swal.fire({
    title: 'Ingrese su nombre',
    input: 'text',
    inputValidator: (value) => {
        if(!value){
            return "Tienes que ingresar tu nombre";
        }
    }
}).then( data => {
    console.log(data);
    userName = data.value;
    socket.emit('newUser', userName);
});

const inputChat = document.getElementById('inputChat');
const messagesLogs = document.getElementById('messagesLogs');

inputChat.addEventListener('keyup', (event) => {
    if(event.key === 'Enter'){
        if(inputChat.value.trim().length > 0){
            socket.emit('message', {user: userName, data: inputChat.value});
        }
    }
});

socket.on('messagesLogs', data => {
    let messages = '';
    console.log({data});
    data.forEach(message => {
        messages += `<p>${message.user} dice: ${message.data}</p>`;
    })
    messagesLogs.innerHTML = messages;
});

socket.on('newUserNotification', userName => {
    console.log("Hola", userName)
    Swal.fire({
        title: `${userName} se conectó`,
        toast: true,
        position: 'top-right'
    })
})