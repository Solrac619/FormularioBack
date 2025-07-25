const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rutas
const formularioRoutes = require('./routes/FormularioRoutes');
const authRoutes = require('./routes/LoginRoutes');

app.use('/api/formulario', formularioRoutes);
app.use('/api', authRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
