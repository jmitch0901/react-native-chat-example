import IO from 'socket.io-client/dist/socket.io'
const SERVER_IP = 'http://192.168.1.107:8080';

const socket = IO(SERVER_IP)
