
exports.studentsHandler = (req, res) => {
    res.render("pages/students", {
        title: "Students",
        pageCSS: "students",
        pageJS: "students",
    });
}

exports.studentDetailHandler = (req, res) => {
    const studentId = req.params.id;
    res.render("pages/student-profile",
        {
            title: "Student Profile",
            studentId: studentId,
            pageCSS: "student-profile",
            pageJS: "student-profile"
        });
}