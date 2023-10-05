const express = require("express");

const app = express();
const PORT = 3000;

// MIDDLEWARES
// -- creating middlewares
const authMiddleware = (req, res, next) => {
  const validAuthorizationValue = "123";
  console.log(req.headers.authorization);
  console.log(req.headers.authorization.slice(7));
  if (req.headers.authorization === validAuthorizationValue) {
    next();
  } else {
    res.status(403).send("Invalid token");
  }
};

// -- using middlewares
app.use(express.json());
// app.use(authMiddleware); // <-- adds protection to ALL routes

// ROUTES
app.get("/", (req, res) => res.send("API is running!"));

app.get("/api", authMiddleware, (req, res) => res.send("API data"));

// STARTING SERVER
app.listen(PORT, () => console.log(`Server is running on port:${PORT}`));

/*
 Route methods
 -------------
 
    app.get()      - works on GET method 
    app.post()     - works on POST method
    app.put()      - works on PUT method
    app.delete()   - works on DELETE method

    app.all()      - works on all methods


Route paths
-----------
    app.get("/api/users")   | "/api/users"* - route pah
    app.post("/api/users")  | "/api/users"* - route pah

    * one path can have multpiple methods

Route parameters
----------------

    app.get("/api/users/:id")       |  :id is parameter which return { id: value } (value is what passed in id)

    /api?name=John&surname=Smith    | ?name=John&surname=Smith is query which returns { name: 'John', surname: 'Smith' }

Route handlers
--------------

    In this method and path:
    app.get('/example/a', (req, res) => {
        res.send('Hello from A!')
    })

    ... this place is a handler:
    (req, res) => {
        res.send('Hello from A!')
    }

    ... insides that handler function, we can reach*:
     req - incoming request to the method and path 
     res - incoming response from method and path 
     
     * additionaly we can reach next function (for example: (req, res, next)) which let's us call other method/path.

Response methods
----------------

    res.json() - Send a JSON response.
    res.send() - Send a response of various types.

    res.sendStatus() - Set the response status code and send its string representation as the response body.

    For example: calling app.post("/api/users") and possible response could be res.sendStatus(201).json(data)

 */
