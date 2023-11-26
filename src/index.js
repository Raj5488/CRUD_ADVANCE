import ConnectDB from './db/db.js'
import app from './app.js'
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

ConnectDB()

.then(() =>{
    app.listen(process.env.PORT || 4000, () =>{
    console.log(`Server is running at post: ${process.env.PORT || 4000}`)
    });
})
.catch((err) =>{
    console.log('Mongodb Connection failed !! ', err)
})


