import express from 'express';
import handlebars from 'express-handlebars';
import viewsRoutes from './routes/views.routes.js';
import { Server } from 'socket.io';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

app.use('/', viewsRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en puerto ${PORT}`);
});

const io = new Server(httpServer);
const messages = [];

io.on('connection', (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on('message', data => {
        messages.push(data);
        io.emit('messagesLogs', messages);
    });
    socket.on('newUser', userName => {
        socket.broadcast.emit('newUserNotification', userName);
    });
});


