const students = require('../data/students');
const courses = require('../data/courses');
const attendance = require('../data/attendance');
const users = require('../data/users');



const calculateStats = () => {
  const activeStudents = students.filter(s => s.status === 'active');
  const activeCourses = courses.filter(c => c.status === 'active');


  //Attendance percentage
  let totalPresent = 0;
  let totalSessions = 0;

  attendance.forEach(courseAtt => {
    courseAtt.weeklyData.forEach(week => {
      totalPresent += week.present;
      totalSessions += week.total;
    });
  });

  const averageAttendance = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;


  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const newStudentsThisMonth = students.filter(s => {
    const enrollDate = new Date(s.enrollmentDate);
    return enrollDate.getMonth() === thisMonth && enrollDate.getFullYear() === thisYear;
  }).length;

  return {
    totalStudents: students.length,
    activeStudents: activeStudents.length,
    activeCourses: activeCourses.length,
    completedCourses: courses.filter(c => c.status === 'completed').length,
    averageAttendance,
    studentGrowth: newStudentsThisMonth > 0 ? `+${newStudentsThisMonth}` : '0',
    courseGrowth: activeCourses.length > 2 ? '+2' : '0'
  }

}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-Us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}



exports.loginPageHandler = (req, res) => {
  const error = req.query.error;
  const success = req.query.success;

  res.render("pages/login", {
    title: "Login",
    pageCSS: "login",
    pageJS: "login",
    error,
    success
  });
};

exports.loginPostHandler = (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !email.trim()) {
    return res.redirect('/login?error=missing_email');
  }
  if (!password || !password.trim()) {
    return res.redirect('/login?error=missing_password');
  }
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password &&
    u.status === 'active'
  );


  if (user) {
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      studentId: user.studentId || null,
      loginTime: new Date()
    }

    if (remember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    } else {
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
    }

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('/login?error=session_error');
      }
      
      // Role-based redirect
      // if (user.role === 'student') {
      //   res.redirect('/student/dashboard'); // Student portal
      // } else {
      //   res.redirect('/dashboard'); // Admin/Teacher dashboard
      // }

      res.redirect('/dashboard'); // Admin/Teacher dashboard

    });



  } else {
    res.redirect('/login?error=invalid_credentials');
  }


};


exports.logoutHandler = (req, res) => {
  if (req.session) {

    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.redirect('/dashboard?error=logout_error');
      }
      
      res.clearCookie('connect.sid'); 
      res.redirect('/login?success=logged_out');
    });
  } else {
    res.redirect('/login');
  }
};
  
exports.dashboardHandler = (req, res) => {
  const stats = calculateStats();
  const activeCourses = courses.filter(c => c.status === 'active');
  const activeStudents = students.filter(s => s.status === 'active');
  const recentStudents = students.filter(s => s.status === 'active').slice(0, 5);
  const currentDate = getCurrentDate();
  

  res.render("pages/dashboard", {
    title: "Dashboard - SMS",
    user: req.session.user,
    stats,
    activeCourses,
    recentStudents,
    currentDate,
    pageCSS: "dashboard",
    pageJS: "dashboard"
  });
};
  
exports.forgetPasswordHandler = (req, res) => {
  const error = req.query.error;
  const success = req.query.success;
  
  res.render("pages/forget-password", { 
    title: "Forgot Password - SMS",
    error,
    success
  });
};

exports.forgetPasswordPostHandler = (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.redirect('/forgot-password?error=missing_email');
    }
    
    // functionality to add ------------------
    res.redirect('/login?success=password_reset');
}

exports.resetPasswordHandler = (req, res) => {
  const token = req.query.token;
  const error = req.query.error;
  
  res.render("pages/reset-password", { 
    title: "Reset Password - SMS",
    token,
    error
  });
};