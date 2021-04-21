// **
// * History Control
// *  Handles bike availability history up to N hours - default 10
// *  The data is saved in a JSON file
// **
const fs = require("fs");

class History {
  // Each networks is related with an hour
  constructor(hour, networks) {
    this.hour = hour;
    this.networks = networks;
  }
}

class HistoryControl {
  constructor() {
    this.date = new Date();
    this.histories = [];
    this.size = 12;

    console.log("Leyendo data json");
    let data = require("../data/data.json");
    const dateD = new Date(data.date);

    // Only history of the day is saved
    // If the data does not correspond to today, delete it
    if (this.date.getDate() === dateD.getDate()) {
      this.histories = data.histories;
    } else {
      this.saveDocument();
    }
  }

  register(networks) {
    // Each time that tried to register a historial the have to be update
    this.date = new Date();

    this.validateHour(networks);
    this.validateSize();
    this.saveDocument();
  }

  validateHour(networks) {
    // Validates if the data for that hour has already been saved, otherwise it saves it
    const hourNow = this.date.getHours();

    const searchHour = this.histories.filter(({ hour }) => {
      return hour === hourNow;
    });

    if (searchHour.length === 0) {
      let history = new History(hourNow, networks);
      this.histories.unshift(history);
    }
  }

  // The document only save an amount of history -> size
  validateSize() {
    if (this.histories.length > this.size) {
      this.histories.pop();
    }
  }

  // Save data in document
  saveDocument() {
    console.log("Guardando documento");
    console.log("Histories: ", this.histories.length);
    let jsonData = {
      date: this.date,
      histories: this.histories,
    };

    let jsonDataString = JSON.stringify(jsonData);

    fs.writeFileSync("./data/data.json", jsonDataString);
  }
}

module.exports = {
  HistoryControl,
};
