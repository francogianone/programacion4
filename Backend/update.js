const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.MONGODB_URI;

mongoose.connect(URI)
  .then(async () => {
    console.log('Connected');
    const db = mongoose.connection;
    await db.collection('productos').updateOne(
      { nombre: 'Harry Potter' },
      { $set: { imagen: '/harrypotter.jpg' } }
    );
    console.log('Updated DB to /harrypotter.jpg');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
