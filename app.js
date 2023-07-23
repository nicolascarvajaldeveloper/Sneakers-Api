const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Crea una Express app
const app = express();
const port = process.env.PORT || 4000;

// nube
app.use(express.json());

// Conecciones Mongoose
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Conexion a la base de datos
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Conectado a la base de datos Mongo');
  })
  .catch((error) => {
    console.error('Error conectando a la base de datos Mongo:', error.message);
    process.exit(1);
  });


const Product = mongoose.model('Product', {
  brand: String,
  clientId: String,
  price: Number,
  specialPrice: Number,
  inStock: Boolean, // Stock producto
});
app.get('/', (req, res) => {
    res.send('Bienvenidos a la API Sneakers');
  });
// Ruta productos en stock
app.get('/products', (req, res) => {
  Product.find({ inStock: true })
    .then((products) => res.json(products))
    .catch((error) => res.status(500).json({ error: 'Error' }));
});

// Ruta precio de los productos
app.get('/price/:user_id/:nombre_producto', async (req, res) => {
  try {
    const { user_id, nombre_producto } = req.params;
    const product = await Product.findOne({ brand: nombre_producto, clientId: user_id }).exec();
    if (product && product.specialPrice !== undefined) {
      res.json({ price: product.specialPrice });
    } else if (product) {
      res.json({ price: product.price });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error en la base de datos:', error);
    res.status(500).json({ error: 'Error servidor' });
  }
});

// Servidor
app.listen(port, () => {
  console.log(`El Servidor está en el puerto: ${port}`);
});
