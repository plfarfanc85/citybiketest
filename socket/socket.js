// **
// * Socket Control
// * To perform a real time application, a request was made every X seconds
// * to the API, a history of Y hours before is saved, the history is only
// * for the present day and the data is sent to the front of the real time
// * and history
// **

const { io } = require("../server");
const { getCityBike } = require("../helper/cityBike");
const { HistoryControl } = require("../classes/history-control");

const interval = 600000;
const historyControl = new HistoryControl();

let dataTotal = {
  live: [],
  history: [],
};

getCityBike()
  .then((data) => {
    historyControl.register(data);
    dataTotal.live = data;
  })
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log("New connection " + socketId + " from " + clientIp);

  dataTotal.history = historyControl.histories;

  socket.emit("bikes", dataTotal);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  setInterval(function () {
    getCityBike().then((data) => {
      historyControl.register(data);
      dataTotal.live = data;
      dataTotal.history = historyControl.histories;

      io.emit("bikes", dataTotal);
      console.log("Updating data bikes", new Date());
    });
  }, interval);
});
