const dotenv = require('dotenv');

// const express = require('express');

import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req: express.Request, res: express.Response) => {   
    res.statusCode = 200;
    res.send('Hello, World!');

});

app.listen(port, () => {
    console.log(`[server]: Server running on localhost:${port}`);
});