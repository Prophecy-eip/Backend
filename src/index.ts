const dotenv = require('dotenv');

const express = require('express');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req: any, res: any) => {
    res.statusCode = 200;
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`[server]: Server running on localhost:${port}`);
});