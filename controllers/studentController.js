
exports.studentsHandler = (req, res) => {
    res.render("pages/students", { title: "Students" });
}

exports.studentDetailHandler = (req, res) => {
    const studentId = req.params.id;
    res.render("pages/student-profile", { title: "Student Profile", studentId: studentId });
}