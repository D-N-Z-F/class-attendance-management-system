import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : "";
  });
  const [students, setStudents] = useState(() => {
    return localStorage.getItem("students")
      ? JSON.parse(localStorage.getItem("students"))
      : [];
  });
  const [classes, setClasses] = useState(() => {
    return localStorage.getItem("classes")
      ? JSON.parse(localStorage.getItem("classes"))
      : [];
  });

  const login = (userData) => setUser(userData);

  const logout = () => setUser("");

  const addStudent = (student) => {
    const oldStudents = JSON.parse(localStorage.getItem("students"));
    const newStudents = [...oldStudents, student];
    setStudents(newStudents);
  };

  const deleteStudent = (id) => {
    const oldStudents = JSON.parse(localStorage.getItem("students"));
    const oldClasses = JSON.parse(localStorage.getItem("classes"));
    oldStudents.splice(id, 1);
    oldClasses.forEach((each) => {
      if (each.students[id.toString()]) {
        console.log("HAHA");
        each.students = each.students.filter(
          (student) => student !== id.toString()
        );
      }
    });
    setStudents(oldStudents);
    setClasses(oldClasses);
  };

  const editStudent = (student, id) => {
    const oldStudents = JSON.parse(localStorage.getItem("students"));
    oldStudents[id] = student;
    setStudents(oldStudents);
  };

  const addClass = (newClass) => {
    const oldClasses = JSON.parse(localStorage.getItem("classes"));
    const newClasses = [...oldClasses, newClass];
    setClasses(newClasses);
  };

  const deleteClass = (id) => {
    const oldClasses = JSON.parse(localStorage.getItem("classes"));
    oldClasses.splice(id, 1);
    setClasses(oldClasses);
  };

  const editClass = (newClass, id) => {
    const oldClasses = JSON.parse(localStorage.getItem("classes"));
    oldClasses[id] = newClass;
    setClasses(oldClasses);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [user, setUser, students, setStudents, classes, setClasses]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        students,
        setStudents,
        addStudent,
        deleteStudent,
        editStudent,
        classes,
        setClasses,
        addClass,
        deleteClass,
        editClass,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
