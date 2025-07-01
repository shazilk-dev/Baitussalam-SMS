
exports.loginPageHandler = (req, res) => {
  res.render("pages/login", {
    title: "Login",
    pageCSS: "login",
    pageJS: "login"
  });
};
  
exports.dashboardHandler = (req, res) => {
  res.render("pages/dashboard", {
    title: "Dashboard",
    user: "Shazil",
    pageCSS: "dashboard",
    pageJS: "dashboard"
  });
};
  
exports.forgetPasswordHandler = (req, res) => {
    // Logic for handling forget password settings
    // This could involve sending a reset link to the user's email
    res.render("pages/reset-password", { title: "Reset Password" });
}

exports.resetPasswordHandler = (req, res) => {
    // Logic for handling reset password settings
    // This could involve updating the user's password in the database
    res.render("pages/reset-password", { title: "Reset Password" });
}