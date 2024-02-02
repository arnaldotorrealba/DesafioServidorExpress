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
  const repertorio = await getRepertorio()
  res.json(repertorio)
}

// POST

const addSong = async (req, res) => {
  const { cancion, artista, tono } = req.body
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
}

// PUT

const editSong = async (req, res) => {
  const { cancion, artista, tono } = req.body
  const { id } = req.params
  let repertorio = await getRepertorio()
  const song = repertorio.find(song => song.id === id)
  if (!song) {
    res.status(404).json({ message: 'Song Not found' })
  }
  repertorio = repertorio.map(song => {
    if (song.id === id) {
      return { id: song.id, cancion, artista, tono }
    }
    return song
  })
  await writeFile('repertorio.json', JSON.stringify(repertorio))
  res.json(repertorio)
}

// DELETE

const deleteSong = async (req, res) => {
  const { id } = req.params
  let repertorio = await getRepertorio()
  const song = repertorio.find(song => song.id === id)
  if (!song) {
    res.status(404).json({ message: 'Song not found' })
  }
  repertorio = repertorio.filter(song => song.id !== id)
  await writeFile('repertorio.json', JSON.stringify(repertorio))
  res.json(repertorio)
}

export { getAllRepertorio, addSong, editSong, deleteSong }
