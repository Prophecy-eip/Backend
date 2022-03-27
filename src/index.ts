const dotenv = require('dotenv');

import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`[server]: Server running on localhost:${port}`);
});