import express from 'express';
import util from 'util';
import bodyParser from 'body-parser';
import { ipcMain as ipc } from 'electron';
import { win } from '../';

const server = express();
server.use(bodyParser.json());

// Start server
const start = () => {
  server.listen(5555);

  // Display a message on the grid
  server.post('/message', (req, res) => {
    if (req.body.message || req.body.lines) {
      // Send message object to renderer window
      win.webContents.send('displayMessage', req.body);

      // Respond with 200 status
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        received: true,
      }));
    } else {
      // Respond with error
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;
      res.send(JSON.stringify({
        error: 'Expected "message" string or "lines" array in request'
      }));
    }
  });

  // Clear the grid
  server.post('/clear', (req, res) => {
    win.webContents.send('displayMessage', { message: '' });

    // Respond with 200 status
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      received: true,
    }));
  })

  // Get grid dimensions
  server.get('/dimensions', (req, res) => {
    // Request dimensions from renderer window
    win.webContents.send('getDimensions');

    // Receive response from renderer
    ipc.once('getDimensions', (event, response) => {
      if (!response.error) {
        // Respond with dimensions object
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
      } else {
        // Respond with error
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.send(JSON.stringify(response));
      }
    });
  });
}

export default {
  start,
}
