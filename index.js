import express from 'express'
import repertorioRoutes from './routes/repertorioRoutes.js'
import { logger } from 'logger-express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware

app.use(express.json())
app.use(cors())
app.use(repertorioRoutes)
app.use(logger())

// Levantamiento del Server

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
