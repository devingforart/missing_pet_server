const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const db = require("./database/models");
const Mensaje = db.Mensaje;
const server = require("http").createServer(app);
const userApi = require("./api/userApi");
const mascotaApi = require("./api/mascotaApi");
const mensajesApi = require("./api/mensajesApi");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
server.listen(4000);
app.use("/", userApi);
app.use("/", mascotaApi);
app.use("/", mensajesApi);

io.on("connection", (socket) => {
  socket.on("message", (body, idEmisor, idReceptor,nombreEmisor) => {
    console.log("DATOS DESDE APP", body);
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
    const objetoFecha = Date.now();
    const nowDate = new Date(objetoFecha);
    let fechaMensaje = nowDate.toLocaleDateString("en-ZA");

    Mensaje.create({
      mensaje: body.body,
      emailEmisor: body.emailEmisor,
      emailReceptor: body.idReceptor,
      fechaMensaje: fechaMensaje,
      nombreEmisor: body.nombreEmisor
    });
  });
});

/* const PORT = process.env.port */
const PORT = 6001;

app.listen(PORT, () => {
  console.log("servidor ON sen puerto: ", PORT);
});
