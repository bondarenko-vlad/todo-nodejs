const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({extended:true})) // мидлвейр для обработки json
app.use('/api/auth',require('./routes/auth.routes')) // обработка роута
app.use('/api/todo',require('./routes/todo.routes'))

const PORT = config.get('port') || 5000

async function start(){
    try {
        await mongoose.connect(config.get('mongoUri'),{ // подключение к БД
            useNewUrlParser:true, 
            useUnifiedTopology:true,
            useCreateIndex:true
        }) 
        app.listen(PORT,()=>console.log('app has been started on ' + PORT))
    } catch (e) {
        console.log('Error', e.message);
        process.exit(1) // завершение процесса
    }
}
start()


