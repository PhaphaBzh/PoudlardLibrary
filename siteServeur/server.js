const express = require("express");
const server = express();
const morgan = require("morgan");
const routerGlobal = require("./routers/global.routers");
const routerBooks = require("./routers/books.routers");
const routerAuthors = require("./routers/authors.routers");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

mongoose.connect("mongodb://localhost:27017/poudlard_library", { useNewUrlParser: true });

server.use(express.static("public"));
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({ extended: false }));
server.set('trust proxy', 1);

server.use((request, response, suite) => {
    response.locals.message = request.session.message;
    delete request.session.message;
    suite();
})

server.use("/livres/", routerBooks);
server.use("/auteurs/", routerAuthors);

server.use("/", routerGlobal);

server.listen(3000);

