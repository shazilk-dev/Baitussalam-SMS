const students = require('../data/students.js')

exports.studentsHandler = (req, res) => {
    res.render("pages/students", {
        title: "Students",
        user: req.session.user, 
        students: students,
        currentPage: "students",
        pageCSS: "students",
        pageJS: "students",
    });
}

exports.studentDetailHandler = (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);
    
    // Add error handling for non-existent student
    if (!student) {
        return res.status(404).render("pages/404");
    }
    
    res.render("pages/student-profile", {
        title: "Student Profile",
        user: req.session.user,
        student: student,
        currentPage: "students",
        pageCSS: "student-profile",
        pageJS: "student-profile"
    });
}