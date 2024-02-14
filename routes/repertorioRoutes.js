import express from 'express'
import {
  getAllRepertory,
  addSong,
  editSong,
  deleteSong
} from '../src/controllers/repertorioController.js'

const router = express.Router()

router.get('/repertorio', getAllRepertory)
router.post('/repertorio', addSong)
router.put('/repertorio/:id', editSong)
router.delete('/repertorio/:id', deleteSong)

export default router
