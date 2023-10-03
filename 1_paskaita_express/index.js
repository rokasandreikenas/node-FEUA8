const express = require("express"); // importuojam express modulį (nepamirštam įsirašyti)
const cors = require("cors");
const app = express(); // sukuriam express aplikaciją
const port = 3000;

// app.use() - aplikacija pritaikys papildomus parametrus
app.use(cors()); // cors() - cors nustatymai naudojami appse

const users = ["Alex", "Rose", "Megan"];

// app.get(kelias, callback funkcija) - aprašomas API
// kelias - kuriuo URL užeisime
// callback funkcija - funkcija kuri bus įvykdita kai užeis į mūsų kelią
app.get("/", (req, res) => {
  res.send("Server is working"); // išsiunčiami duomenys kvietėjui
});

app.get("/users", (req, res) => {
  res.send(users);
});

// :firstLetter - dinaminis route (dvitaškis nurodo, kad tai yra dinaminis)
app.get("/users/:firstLetter", (req, res) => {
  const { firstLetter } = req.params;
  // /users/R => ["Rose"]
  // /users/M => ["Megan"]
  // /users/K => []

  const foundUsers = users.filter((user) => user[0] === firstLetter);
  res.send(foundUsers);
});

app.get("/fruits", (req, res) => {
  res.send(["Apple", "Banana"]);
});

// paleidžiamas serveris, kuris klausosi mūsų nurodytu portu
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
