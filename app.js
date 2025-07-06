const express = require("express");
const app = express();
const session = require('express-session');
const path = require("path");
const authRoutes = require("./routes/auth"); 
const studentRoutes = require("./routes/students");

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(express.static("public")); 
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: 'sms-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}))

app.use("/", authRoutes);
app.use('/students', studentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.status || err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';
  
  res.status(statusCode).render("pages/error", {
    title: `Error ${statusCode}`,
    statusCode: statusCode,
    error: statusCode === 500 ? 'Internal Server Error' : errorMessage,
    message: statusCode === 500 ? 
      'We encountered an unexpected error. Please try again later.' : 
      errorMessage
  });
});

app.use((req, res, next) => {
  res.status(404).render("pages/404");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
