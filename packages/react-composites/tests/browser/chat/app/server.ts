import express from 'express';

let server: any;
const app = express();
app.use(express.static(__dirname + '/dist'));

export const startServer = () =>
  new Promise((resolve, reject) => {
    server = app.listen(3000, () => {
      console.log('App listening on 3000');
      resolve(true);
    });
  });

export const stopServer = () =>
  new Promise((resolve, reject) => {
    if (!server) reject(false);
    server.close(() => {
      resolve(true);
    });
  });
