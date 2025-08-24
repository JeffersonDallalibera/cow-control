// app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importando as rotas com nomes atualizados
const animaisRoutes = require('./routes/animais.routes');
const ccsRoutes = require('./routes/ccs.routes');
const raqueteRoutes = require('./routes/raquete.routes');
const ccsTanqueRoutes = require('./routes/ccsTanque.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
app.use(cors());
app.use(express.json());

// --- MUDANÇAS AQUI ---
// Adicionamos o prefixo /api e usamos nomes de recursos no plural e em português
app.use('/api/animais', animaisRoutes);
app.use('/api/ccs', ccsRoutes);
app.use('/api/raquete', raqueteRoutes);
app.use('/api/ccs-tanque', ccsTanqueRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de "health check" para saber se a API está no ar
app.get('/api', (req, res) => {
  res.json({ message: 'API VetControl está funcionando!' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});