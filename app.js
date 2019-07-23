const express = require("express"),
	  app = express(),
	  port = process.env.PORT || 3000;

// requiring routes
const indexRoutes = require("./routes/index.js");

app.set("view engine", "ejs");

app.use("/", indexRoutes);

app.listen(port, () => {
	console.log("WishNet server has started!");
});