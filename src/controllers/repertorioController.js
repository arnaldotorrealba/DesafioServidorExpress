import { nanoid } from 'nanoid'
import { writeFile, readFile } from 'node:fs/promises'

// Obtenemos el Repertorio

const getRepertorio = async () => {
  const fsResponse = await readFile('repertorio.json', 'utf8')
  const repertory = JSON.parse(fsResponse)
  return repertory
}

// GET

const getAllRepertory = async (req, res) => {
  try {
    const repertory = await getRepertorio()
    res.status(200).json(repertory)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el repertorio' })
    console.error('Error al procesar la solicitud:', error)
  }
}

// POST

const addSong = async (req, res) => {
  try {
    const { cancion, artista, tono } = req.body
    if (!cancion.trim() || !artista.trim() || !tono.trim()) {
      return res
        .status(400)
        .json({ error: 'Los campos no pueden estar vacíos' })
    }
    const newSong = {
      id: nanoid(),
      cancion,
      artista,
      tono
    }
    let repertory = await getRepertorio()
    repertory.push(newSong)
    await writeFile('repertorio.json', JSON.stringify(repertory))
    res.status(201).json(repertory)
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir canción' })
    console.error('Error al procesar la solicitud:', error)
  }
}

// PUT

const editSong = async (req, res) => {
  try {
    const { cancion, artista, tono } = req.body
    if (!cancion.trim() || !artista.trim() || !tono.trim()) {
      return res
        .status(400)
        .json({ error: 'Los campos no pueden estar vacíos' })
    }
    const { id } = req.params
    let repertory = await getRepertorio()
    const songIndex = repertory.findIndex(song => song.id === id)
    if (songIndex === -1) {
      return res.status(404).json({ message: 'Canción no encontrada' })
    }
    repertory[songIndex] = { id, cancion, artista, tono }
    await writeFile('repertorio.json', JSON.stringify(repertory))
    res.status(200).json(repertory)
  } catch (error) {
    res.status(500).json({ error: 'Error al editar canción' })
    console.error('Error al procesar la solicitud:', error)
  }
}

// DELETE

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params
    let repertory = await getRepertorio()
    const songIndex = repertory.find(song => song.id === id)
    if (songIndex === -1) {
      return res.status(404).json({ message: 'Canción no encontrada' })
    }
    repertory = repertory.filter(song => song.id !== id)
    await writeFile('repertorio.json', JSON.stringify(repertory))
    res.status(200).json(repertory)
  } catch (error) {
    res.status(500).json({ error: 'Error al editar canción' })
    console.error('Error al procesar la solicitud:', error)
  }
}

export { getAllRepertory, addSong, editSong, deleteSong }
