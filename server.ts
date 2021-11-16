const express = require('express');

const morgan = require('morgan');
const clientSession = require('client-sessions');
const helmet = require('helmet');


const app = express();
import api from "./src/api";

app.get('/', (request, response) => response.sendStatus(200));
app.get('/health', (request, response) => response.sendStatus(200));

app.use(morgan('short'));
app.use(express.json());



app.use(helmet());

app.use(api);
app.get('*',(req, res, next) => {
  res.status(404).send({
    status: 404,
    error: 'Not found'
  })
})

let server;
export default {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  }
};
