module.exports = function setupChatSocket(io) {
    io.on('connection', (socket) => {
      const session = socket.request.session;
      const user = session.user;
  
      if (!user) {
        socket.emit('unauthorized', 'You must be logged in to use the chat.');
        socket.disconnect(true);
        return;
      }
  
      console.log(`${user.username} connected to chat`);
  
      socket.on('chat message', (msg) => {
        io.emit('chat message', {
          user: user.username,
          text: msg,
          time: new Date()
        });
      });
  
      socket.on('disconnect', () => {
        console.log(`${user.username} disconnected from chat`);
      });
    });
  };
  