const students = require('../data/students.js')

exports.studentsHandler = (req, res) => {
    res.render("pages/students", {
        title: "Students",
        students: students,
        pageCSS: "students",
        pageJS: "students",
    });
}

exports.studentDetailHandler = (req, res) => {
    const studentId = req.params.id;
    const student = students.find(s => s.id === studentId);
    res.render("pages/student-profile",
        {
            title: "Student Profile",
            student: student,
            pageCSS: "student-profile",
            pageJS: "student-profile"
        });
}