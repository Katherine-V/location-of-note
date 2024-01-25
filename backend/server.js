const express = require('express');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes

// Return notes.html
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

// Return index.html for other routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API Routes

// Return all notes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
});

// Save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4(); // Assign a unique id
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

// DELETE a note by id
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  notes = notes.filter(note => note.id !== noteId);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
