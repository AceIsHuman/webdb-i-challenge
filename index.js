const server = require('./server.js');
const db = require('./data/dbConfig');

const PORT = process.env.PORT || 4000;

// GET ALL ACCOUNTS
server.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await db('*').from('accounts');
    accounts.length ?
      res.status(200).json({accounts}) :
      res.status(200).json({ message: 'There are no accounts' });
  } catch(err) {
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
});

// ADD A NEW ACCOUNT
server.post('/api/accounts', async (req, res) => {
  try {
    const id = await db('accounts').insert(req.body);
    res.status(200).json(id);
  } catch(err) {
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});