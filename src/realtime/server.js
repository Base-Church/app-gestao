const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users_online.json');

// Estrutura para armazenar usuários online
let usersOnline = {};

// Função para salvar dados no arquivo JSON
async function saveUsersData() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(usersOnline, null, 2));
  } catch (error) {
    console.error('Erro ao salvar dados dos usuários:', error);
  }
}

// Função para carregar dados do arquivo JSON
async function loadUsersData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    usersOnline = JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, criamos um objeto vazio
    usersOnline = {};
    await saveUsersData();
  }
}

// Inicializar dados ao iniciar o servidor
loadUsersData();

// Middleware para autenticação do socket
io.use((socket, next) => {
  const { sessionId, userId, userName, organizacaoId } = socket.handshake.auth;
  
  if (!sessionId || !userId || !userName || !organizacaoId) {
    return next(new Error('Dados de autenticação inválidos'));
  }
  
  socket.sessionId = sessionId;
  socket.userId = userId;
  socket.userName = userName;
  socket.organizacaoId = organizacaoId;
  
  next();
});

// Conexão do socket
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.userName} (${socket.userId})`);

  // Adicionar usuário à lista de online
  usersOnline[socket.sessionId] = {
    userId: socket.userId,
    userName: socket.userName,
    organizacaoId: socket.organizacaoId,
    socketId: socket.id,
    connectedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    currentPage: 'inicio',
    status: 'online'
  };

  // Salvar no arquivo JSON
  saveUsersData();

  // Notificar outros usuários da mesma organização sobre novo usuário online
  socket.broadcast.emit('user-connected', {
    userId: socket.userId,
    userName: socket.userName,
    organizacaoId: socket.organizacaoId
  });

  // Enviar lista de usuários online para o usuário recém-conectado
  const orgUsers = Object.values(usersOnline).filter(user => 
    user.organizacaoId === socket.organizacaoId && user.status === 'online'
  );
  socket.emit('users-online', orgUsers);

  // Evento para atualizar página atual do usuário
  socket.on('page-changed', (pageData) => {
    if (usersOnline[socket.sessionId]) {
      usersOnline[socket.sessionId].currentPage = pageData.page;
      usersOnline[socket.sessionId].lastActivity = new Date().toISOString();
      
      // Salvar no arquivo JSON
      saveUsersData();
      
      // Notificar outros usuários da mesma organização
      socket.broadcast.emit('user-page-changed', {
        userId: socket.userId,
        userName: socket.userName,
        currentPage: pageData.page
      });
    }
  });

  // Evento para atualizar atividade do usuário
  socket.on('user-activity', (activityData) => {
    if (usersOnline[socket.sessionId]) {
      usersOnline[socket.sessionId].lastActivity = new Date().toISOString();
      usersOnline[socket.sessionId].activity = activityData.activity;
      
      // Detectar se o usuário está na aba ou não
      if (activityData.tabActive !== undefined) {
        usersOnline[socket.sessionId].tabActive = activityData.tabActive;
      }
      
      // Salvar no arquivo JSON
      saveUsersData();
      
      // Notificar outros usuários se o status mudou significativamente
      if (activityData.activity === 'away' || activityData.activity === 'active') {
        socket.broadcast.emit('user-status-changed', {
          userId: socket.userId,
          userName: socket.userName,
          activity: activityData.activity,
          tabActive: activityData.tabActive
        });
      }
    }
  });

  // Evento para limpar sessão do usuário (quando faz logout)
  socket.on('user-logout', () => {
    console.log(`Usuário fazendo logout: ${socket.userName} (${socket.userId})`);
    
    if (usersOnline[socket.sessionId]) {
      delete usersOnline[socket.sessionId];
      saveUsersData();
      
      // Notificar outros usuários
      socket.broadcast.emit('user-disconnected', {
        userId: socket.userId,
        userName: socket.userName,
        organizacaoId: socket.organizacaoId
      });
    }
  });

  // Desconexão do usuário
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.userName} (${socket.userId})`);
    
    if (usersOnline[socket.sessionId]) {
      usersOnline[socket.sessionId].status = 'offline';
      usersOnline[socket.sessionId].disconnectedAt = new Date().toISOString();
      
      // Salvar no arquivo JSON
      saveUsersData();
      
      // Notificar outros usuários da mesma organização
      socket.broadcast.emit('user-disconnected', {
        userId: socket.userId,
        userName: socket.userName,
        organizacaoId: socket.organizacaoId
      });
    }
  });
});

// Rota para obter usuários online (endpoint REST)
app.get('/api/users-online/:organizacaoId', (req, res) => {
  const { organizacaoId } = req.params;
  
  const orgUsers = Object.values(usersOnline).filter(user => 
    user.organizacaoId === organizacaoId && user.status === 'online'
  );
  
  res.json({
    success: true,
    data: orgUsers,
    total: orgUsers.length
  });
});

// Rota para limpar usuários offline antigos
app.post('/api/cleanup-offline-users', (req, res) => {
  const hoursAgo = 24; // Remover usuários offline há mais de 24 horas
  const cutoffTime = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
  
  let removedCount = 0;
  Object.keys(usersOnline).forEach(sessionId => {
    const user = usersOnline[sessionId];
    if (user.status === 'offline' && user.disconnectedAt) {
      const disconnectedTime = new Date(user.disconnectedAt);
      if (disconnectedTime < cutoffTime) {
        delete usersOnline[sessionId];
        removedCount++;
      }
    }
  });
  
  saveUsersData();
  
  res.json({
    success: true,
    message: `${removedCount} usuários offline removidos`,
    removedCount
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
  console.log(`Arquivo de dados: ${DATA_FILE}`);
});
