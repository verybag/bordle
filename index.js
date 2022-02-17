const PORT = 8000;
const axios = require('axios').default;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.get('/word', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getRandom',
    params: { wordLength: '5' },
    headers: {
      'x-rapidapi-host': 'random-words5.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY,
    },
  };
  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get('/check', (req, res) => {
  console.log(req);
  const options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
    params: { entry: req.query.word },
    headers: {
      'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data.result_msg);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
