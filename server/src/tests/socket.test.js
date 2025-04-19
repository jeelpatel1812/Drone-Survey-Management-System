// tests/socketAuth.test.js
import { io as ClientIO } from "socket.io-client";
import http from "http";
import { Server } from "socket.io";
import express from "express";

let io, serverSocket, clientSocket;

beforeAll((done) => {
  const app = express();
  const server = http.createServer(app);
  io = new Server(server);

  io.on("connection", (socket) => {
    serverSocket = socket;

    socket.on("authenticate", (token) => {
      if (token === "valid-token") {
        socket.emit("authenticated", { success: true });
      } else {
        socket.emit("authenticated", { success: false });
      }
    });
  });

  server.listen(() => {
    const port = server.address().port;
    clientSocket = ClientIO(`http://localhost:${port}`);
    clientSocket.on("connect", done);
  });
});

afterAll(() => {
  io.close();
  clientSocket.close();
});

test("should authenticate with valid token", (done) => {
  clientSocket.emit("authenticate", "valid-token");

  clientSocket.on("authenticated", (data) => {
    expect(data.success).toBe(true);
    done();
  });
});

test("should fail with invalid token", (done) => {
  clientSocket.emit("authenticate", "invalid-token");

  clientSocket.on("authenticated", (data) => {
    expect(data.success).toBe(false);
    done();
  });
});
