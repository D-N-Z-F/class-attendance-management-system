import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import {
  PencilSquareIcon,
  UserMinusIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import "../../globals.css";
import { toast } from "react-toastify";

export default function StudentProfileManagement() {
  const { students, addStudent, deleteStudent, editStudent } = useAuth();

  const [adding, setAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    icNo: "",
    DOB: "",
    address: "",
    phoneNo: "",
    contacts: {
      parent: "",
      guardian: "",
    },
    classes: [],
  });

  const [editing, setEditing] = useState(false);
  const [oldStudent, setOldStudent] = useState(null);
  const [oldStudentId, setOldStudentId] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const Paginate = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return students.slice(start, end).map((student, i) => (
      <tr key={i}>
        <td className={styles.tableData}>
          {i +
            (currentPage === 1
              ? currentPage
              : (currentPage - 1) * (itemsPerPage + 1))}
        </td>
        <td className={styles.tableData}>{student.name}</td>
        <td className={styles.tableData}>{student.email || "N/A"}</td>
        <td className={styles.tableData}>{student.icNo || "N/A"}</td>
        <td className={styles.tableData}>{student.DOB || "N/A"}</td>
        <td className={styles.tableData}>
          {student.address.length > 15
            ? `${student.address.slice(0, 15)}...`
            : student.address || "N/A"}
        </td>
        <td className={styles.tableData}>{student.phoneNo || "N/A"}</td>
        <td className={styles.tableData}>
          Parent: {student.contacts.parent || "N/A"}
          <br />
          Guardian: {student.contacts.guardian || "N/A"}
        </td>
        <td className={styles.tableData}>
          <button
            onClick={() => {
              setOldStudent({ ...student });
              setOldStudentId(i);
              setEditing(true);
            }}
            className={`bg-amber-400 ${styles.actionButtons}`}
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIdToDelete(i);
              setDeleting(true);
            }}
            className={`bg-rose-400 ${styles.actionButtons}`}
          >
            <UserMinusIcon className="w-5 h-5" />
          </button>
        </td>
      </tr>
    ));
  };

  // eslint-disable-next-line
  const prevPage = () => setCurrentPage(() => Math.max(currentPage - 1, 1));

  const nextPage = () =>
    setCurrentPage(() => Math.min(currentPage + 1, totalPages));

  const dateFormatter = (date) =>
    `${date.slice(8)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;

  const validateNewData = (studentData, id) => {
    const { name, email, icNo, DOB, address, phoneNo, contacts } = studentData;
    let isValid = true;
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      icNo.trim() === "" ||
      (contacts.parent.trim() === "" && contacts.guardian.trim() === "")
    ) {
      isValid = false;
      toast.warning("Must include Name, IC, and a Parent/Guardian contact!");
    }
    students.forEach((student, i) => {
      if (id !== i) {
        if (
          name === student.name ||
          email === student.email ||
          icNo === student.icNo
        ) {
          isValid = false;
          toast.warning("Duplicate data found!");
        }
      } else {
        if (
          name === student.name &&
          email === student.email &&
          icNo === student.icNo &&
          DOB === student.DOB &&
          address === student.address &&
          phoneNo === student.phoneNo &&
          contacts.parent === student.contacts.parent &&
          contacts.guardian === student.contacts.guardian
        ) {
          isValid = false;
          toast.warning("Nothing to update!");
        }
      }
    });
    return isValid;
  };

  const onChangeHandler = (e) => {
    if (adding) {
      if (e.target.name === "DOB") {
        setNewStudent({
          ...newStudent,
          [e.target.name]: dateFormatter(e.target.value),
        });
      } else if (e.target.name === "parent" || e.target.name === "guardian") {
        setNewStudent({
          ...newStudent,
          contacts: { ...newStudent.contacts, [e.target.name]: e.target.value },
        });
      } else {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
      }
    } else if (editing) {
      if (e.target.name === "DOB") {
        setOldStudent({
          ...oldStudent,
          [e.target.name]: dateFormatter(e.target.value),
        });
      } else if (e.target.name === "parent" || e.target.name === "guardian") {
        setOldStudent({
          ...oldStudent,
          contacts: { ...oldStudent.contacts, [e.target.name]: e.target.value },
        });
      } else {
        setOldStudent({ ...oldStudent, [e.target.name]: e.target.value });
      }
    }
  };

  const onSubmitHandler = (e) => {
    if (adding) {
      if (validateNewData(newStudent, students.length)) {
        addStudent(newStudent);
        setNewStudent({
          name: "",
          email: "",
          icNo: "",
          DOB: "",
          address: "",
          phoneNo: "",
          contacts: {
            parent: "",
            guardian: "",
          },
          classes: [],
        });
        setAdding(false);
        toast.success("Added successfully.");
      }
    } else if (editing) {
      if (validateNewData(oldStudent, parseInt(oldStudentId))) {
        editStudent({ ...oldStudent }, oldStudentId);
        setOldStudent(null);
        setOldStudentId(null);
        setEditing(false);
        toast.success("Updated successfully.");
      }
    }
  };

  const onDeleteHandler = (id) => {
    deleteStudent(id);
    setIdToDelete(null);
    setDeleting(false);
    toast.success("Deleted successfully.");
  };

  const styles = {
    tableHeading: "border border-sky-700 rounded-sm p-2 bg-sky-500",
    tableData:
      "border border-sky-500 rounded-sm p-2 bg-sky-100 text-center whitespace-nowrap lg:text-base md:text-sm text-xs",
    actionButtons: "p-2 m-2 rounded-md transition ease hover:scale-125",
    formLayout: "w-4/5 mx-auto my-1 rounded-sm",
    deleteDialogButtons:
      "py-1 mx-auto rounded-md transition ease hover:scale-105 hover:text-sky-100",
    backButtonDivs:
      "backBtnDiv m-5 sm:p-5 p-2 rounded-md transition ease hover:scale-75 hover:cursor-pointer",
    backButtonIcons: "sm:w-12 sm:h-12 w-8 h-8 text-sky-100",
    prompts:
      "h-3/4 sm:w-2/4 w-full bg-sky-300 rounded-md flex flex-col justify-center items-center",
  };

  useEffect(() => {
    if (totalPages < currentPage) {
      prevPage();
    }
  }, [deleting, setDeleting, currentPage, prevPage, totalPages]);

  return (
    <>
      <div className="h-5/6 p-4 flex flex-col items-center relative">
        <h1 className="sm:text-2xl text-sm mb-2 font-bold flex items-center">
          Student Profile Management Page
          <button
            className={`bg-emerald-400 ml-5 ${styles.actionButtons}`}
            onClick={() => setAdding(true)}
          >
            <UserPlusIcon className="w-8 h-8" />
          </button>
        </h1>
        {!students.length ? (
          <div className="mt-10">
            <h1 className="animate-bounce">No data to display.</h1>
          </div>
        ) : (
          <div className="overflow-auto w-5/6">
            <table className="w-full table-auto border-separate border-4 border-blue-500 rounded-sm">
              <thead>
                <tr>
                  <th className={styles.tableHeading}>Index</th>
                  <th className={styles.tableHeading}>Name</th>
                  <th className={styles.tableHeading}>Email</th>
                  <th className={styles.tableHeading}>IC No.</th>
                  <th className={styles.tableHeading}>DoB</th>
                  <th className={styles.tableHeading}>Address</th>
                  <th className={styles.tableHeading}>Phone No.</th>
                  <th className={styles.tableHeading}>Contacts</th>
                  <th className={styles.tableHeading}>Actions</th>
                </tr>
              </thead>
              <tbody className="overflow-x-auto">
                {!students.length ? null : Paginate()}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`${currentPage === 1 ? "hidden" : null}`}
              >
                Previous
              </button>
              <span className="mx-2">{`${currentPage} / ${totalPages}`}</span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`${currentPage === totalPages ? "hidden" : null}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {!adding ? null : (
        <div className="addPrompt">
          <div className={styles.prompts}>
            <h1 className="p-2 mb-4 text-2xl font-bold border-b-2 border-slate-800">
              New Student Details
            </h1>
            <div className="w-full flex flex-col">
              <div className={`${styles.formLayout} flex`}>
                <input
                  className="p-2 w-1/2"
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={onChangeHandler}
                />
                <input
                  className="p-2 ml-1 w-1/2"
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={onChangeHandler}
                />
              </div>

              <div className={`${styles.formLayout} flex`}>
                <input
                  className="p-2 w-1/2"
                  type="text"
                  name="icNo"
                  placeholder="IC No."
                  onChange={onChangeHandler}
                />
                <input
                  className="p-2 ml-1 w-1/2"
                  type="text"
                  name="phoneNo"
                  placeholder="Phone No."
                  onChange={onChangeHandler}
                />
              </div>

              <input
                className={`${styles.formLayout} p-1`}
                type="date"
                name="DOB"
                placeholder="Date Of Birth"
                onChange={onChangeHandler}
              />
              <input
                className={`${styles.formLayout} p-2`}
                type="text"
                name="address"
                placeholder="Address"
                onChange={onChangeHandler}
              />

              <div className={`${styles.formLayout} flex`}>
                <input
                  className="p-2 w-1/2"
                  type="text"
                  name="parent"
                  placeholder="Parent No."
                  onChange={onChangeHandler}
                />
                <input
                  className="p-2 ml-1 w-1/2"
                  type="text"
                  name="guardian"
                  placeholder="Guardian No."
                  onChange={onChangeHandler}
                />
              </div>

              <button
                onClick={onSubmitHandler}
                className="bg-emerald-400 w-1/5 p-3 mx-auto my-1 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
          <div
            onClick={() => {
              setNewStudent({
                name: "",
                email: "",
                icNo: "",
                DOB: "",
                address: "",
                phoneNo: "",
                contacts: {
                  parent: "",
                  guardian: "",
                },
                classes: [],
              });
              setAdding(false);
            }}
            className={styles.backButtonDivs}
          >
            <XCircleIcon className={styles.backButtonIcons} />
          </div>
        </div>
      )}
      {!editing ? null : (
        <div className="editPrompt">
          <div className={styles.prompts}>
            <h1 className="p-2 mb-4 text-2xl font-bold border-b-2 border-slate-800">
              Edit Student Details
            </h1>
            <div className="w-full flex flex-col">
              <div className={`${styles.formLayout} flex`}>
                <input
                  className="p-2 w-1/2"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={oldStudent.name}
                  onChange={onChangeHandler}
                />
                <input
                  className="p-2 ml-1 w-1/2"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={oldStudent.email}
                  onChange={onChangeHandler}
                />
              </div>

              <div className={`${styles.formLayout} flex`}>
                <input
                  className="p-2 w-1/2"
                  type="text"
                  name="icNo"
                  placeholder="IC No."
                  value={oldStudent.icNo}
                  onChange={onChangeHandler}
                />
                <input
                  className="p-2 ml-1 w-1/2"
                  type="text"
                  name="phoneNo"
                  placeholder="Phone No."
                  value={oldStudent.phoneNo}
                  onChange={onChangeHandler}
                />
              </div>

              <input
                className={`${styles.formLayout} p-1`}
                type="date"
                name="DOB"
                placeholder="Date Of Birth"
                onChange={onChangeHandler}
              />
              <input
                className={`${styles.formLayout} p-2`}
                type="text"
                name="address"
                placeholder="Address"
                value={oldStudent.address}
                onChange={onChangeHandler}
              />

              <div className={`${styles.formLayout} flex`}>
                <input
                  className="p-2 w-1/2"
                  type="text"
                  name="parent"
                  placeholder="Parent No."
                  value={oldStudent.contacts.parent}
                  onChange={onChangeHandler}
                />
                <input
                  className="p-2 ml-1 w-1/2"
                  type="text"
                  name="guardian"
                  placeholder="Guardian No."
                  value={oldStudent.contacts.guardian}
                  onChange={onChangeHandler}
                />
              </div>

              <button
                onClick={onSubmitHandler}
                className="bg-emerald-400 w-1/5 p-3 mx-auto my-1 rounded-md sm:text-base text-xs"
              >
                Update
              </button>
            </div>
          </div>
          <div
            onClick={() => {
              setOldStudent(null);
              setOldStudentId(null);
              setEditing(false);
            }}
            className={styles.backButtonDivs}
          >
            <XCircleIcon className={styles.backButtonIcons} />
          </div>
        </div>
      )}
      {!deleting ? null : (
        <div className="deletePrompt">
          <div className="h-2/4 w-full sm:w-3/4 md:w-2/4 lg:w-1/4 bg-sky-100 rounded-md p-2">
            <div className="w-full h-3/4 flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold">Are You Sure?</h1>
              <p className="pulsatingLine">This Action Cannot Be Undone!</p>
            </div>
            <div className="w-full h-1/4 flex justify-center p-5">
              <button
                onClick={() => onDeleteHandler(idToDelete)}
                className={`${styles.deleteDialogButtons} bg-emerald-400 w-full`}
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleting(false)}
                className={`${styles.deleteDialogButtons} bg-rose-400 w-full ml-2`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
