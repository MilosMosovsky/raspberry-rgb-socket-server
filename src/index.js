import http from 'http';
import socket from 'socket.io';
import RGBControl from './lib/RGBControl';

const server = http.createServer();
const io = socket(server);
const RGB = new RGBControl(27, 22, 23);

io.on('connection', function(client){
  console.log(`Connected slave: ${client.id}`);

  client.on('rgb:color', function(data){
    console.log(`Setting color: (${data.red}, ${data.green}, ${data.blue})`);
    RGB.setColor(data.red, data.green, data.blue);
  });

  client.on('rgb:intensity', function(data){
    console.log(`Setting intensity: ${data.intensity}`);
    RGB.setIntensity(data.intensity);
  });

});

server.listen(10000);
