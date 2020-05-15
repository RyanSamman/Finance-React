const path = require("path")
const express = require ("express")

//function to launch our node app

const app = express()

// use a file from a directory instead of locally from our machines

const PublicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(path.join(__dirname, "../public")));



// create routes from our pages

app.get("/home", req, res) => {
    res.send("")
}

app.get("/crypto", req, res) => {
    res.send("")
}

app.get("/stocks", req, res) => {
    res.send("")
}

app.get("/news", req, res) => {
    res.send("")
}

app.get("/contact", req, res) => {
    res.send("")
}
