var bodyParser = require('body-parser'),
    http = require('http'),
    express = require('express'),
    chat = require('./Chat'),
    socketio = require('socket.io')

var port = port = process.env.PORT || 3000,
    app = express(),
    Server = http.createServer(app),
    io = socketio(Server)


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use('/Chat', chat)
app.use(express.static('public'))

Server.listen(port, function(){
    console.log("Server is running on port: "+port)
})

io.on('Connection', function(socket){
    console.log('new user connected, socket: '+ socket.id)
    
    socket.on('userJoin', function(user){
        //Escuchar el evento user join, para agregar un usuario y emitirlo a los otros sockets
        socket.user = user
        socket.broadcast.emit('userJoin', user)
    })
    
    socket.on('message', function(message){
        //Escuchar el evento message, para emitirlo a otro sockets
        socket.broadcast.emit('message', message)
    })
    
    socket.on('disconnect', function(){
        //Escucha el evento de desconexion para eliminar el usuario
        if(socket.hasOwnProperty('user')){
            deleteUser(socket.user, function(err, confirm){
                if(err) throw err
            })
        }
    })
    
    
})