const express = require('express');
const cors = require('cors');
require('dotenv').config();

const animalRoutes = require('./routes/cowRoute');
const ccsRoutes = require('./routes/ccsRoute');
const raqueteRoutes = require('./routes/raqueteRoute');
const ccsTanqueRoutes = require('./routes/ccsTanqueRoute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/animal', animalRoutes);
app.use('/ccs', ccsRoutes);
app.use('/raquete', raqueteRoutes);
app.use('/ccs-tanque', ccsTanqueRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});
