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

// GET ACCOUNT BY ID
server.get('/api/accounts/:id', validateAccountID, (req, res) => {
  return res.status(200).json(req.account);
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

// UPDATE AN ACCOUNT
server.put('/api/accounts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const success = await db('accounts').where({id}).update(req.body);
    res.status(200).json(success);
  } catch(err) {
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
});

// DELETE AN ACCOUNT
server.delete('/api/accounts/:id', async (req, res) => {
  const id  = req.params.id;
  try {
    const success = await db('accounts').where({id}).del();
    success
      ? res.status(204).end()
      : res.status(400).json({ message: "Invalid ID" });
  } catch(err) {
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
});

// MIDDLEWARE
async function validateAccountID(req, res, next) {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Please provide an ID" });
  try {
    const account = await db('accounts').where({id}).first();
    account
      ? req.account = account
      : res.status(400).json({ message: "Invalid ID" });
    } catch(error) {
      res.status(500).json({ errorMessage: "Unable to validate id", error});
    }
    next();
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});