const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json({extended: true}));
app.use('/api/auth', require ('./routes/auth.route'));

async function start(){
  try {
    await mongoose.connect('mongodb+srv://Defalt:rascudrit2049@cluster0.lxdz2.mongodb.net/?retryWrites=true&w=majority', {
      useUnifiedTopology: true,
    })

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start();