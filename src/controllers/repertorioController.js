import { nanoid } from 'nanoid'
import { writeFile, readFile } from 'node:fs/promises'

// Obtenemos el Repertorio

const getRepertorio = async () => {
  const fsResponse = await readFile('repertorio.json', 'utf8')
  const repertorio = JSON.parse(fsResponse)
  return repertorio
}

// GET

const getAllRepertorio = async (req, res) => {
  try {
    const repertorio = await getRepertorio()
    res.status(200).json(repertorio)
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
    let repertorio = await getRepertorio()
    repertorio.push(newSong)
    await writeFile('repertorio.json', JSON.stringify(repertorio))
    res.status(201).json(repertorio)
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
    let repertorio = await getRepertorio()
    const songIndex = repertorio.findIndex(song => song.id === id)
    if (songIndex === -1) {
      return res.status(404).json({ message: 'Canción no encontrada' })
    }
    repertorio[songIndex] = { id, cancion, artista, tono }
    await writeFile('repertorio.json', JSON.stringify(repertorio))
    res.status(200).json(repertorio)
  } catch (error) {
    res.status(500).json({ error: 'Error al editar canción' })
    console.error('Error al procesar la solicitud:', error)
  }
}

// DELETE

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params
    let repertorio = await getRepertorio()
    const songIndex = repertorio.find(song => song.id === id)
    if (songIndex === -1) {
      return res.status(404).json({ message: 'Canción no encontrada' })
    }
    repertorio = repertorio.filter(song => song.id !== id)
    await writeFile('repertorio.json', JSON.stringify(repertorio))
    res.status(200).json(repertorio)
  } catch (error) {
    res.status(500).json({ error: 'Error al editar canción' })
    console.error('Error al procesar la solicitud:', error)
  }
}

export { getAllRepertorio, addSong, editSong, deleteSong }
