const express = require("express");
const app = express();
const path = require("path");
const authRoutes = require("./routes/auth"); 
const studentRoutes = require("./routes/students");

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(express.static("public")); 
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

app.use("/", authRoutes);
app.use('/students', studentRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
