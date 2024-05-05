import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import "../../globals.css";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  UserGroupIcon,
  UserMinusIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function ClassManagement() {
  const { classes, addClass, deleteClass, editClass, students } = useAuth();

  const [adding, setAdding] = useState(false);
  const [newClass, setNewClass] = useState({
    className: "",
    description: "",
    students: [],
    attendance: {},
  });

  const [editing, setEditing] = useState(false);
  const [oldClass, setOldClass] = useState(null);
  const [oldClassId, setOldClassId] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [allocating, setAllocating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  const Paginate = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return classes.slice(start, end).map((each, i) => (
      <tr key={i}>
        <td className={styles.tableData}>
          {i +
            (currentPage === 1
              ? currentPage
              : (currentPage - 1) * (itemsPerPage + 1))}
        </td>
        <td className={styles.tableData}>{each.className || "N/A"}</td>
        <td className={styles.tableData}>
          {each.description.length > 15
            ? `${each.description.slice(0, 15)}...`
            : each.description || "N/A"}
        </td>
        <td className={styles.tableData}>{each.students.length || "N/A"}</td>
        <td className={styles.tableData}>
          <button
            onClick={() => {
              setOldClass({ ...each });
              setOldClassId(i);
              setAllocating(true);
            }}
            className={`bg-emerald-400 ${styles.actionButtons}`}
          >
            <UserGroupIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setOldClass({ ...each });
              setOldClassId(i);
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

  const nextPage = () =>
    setCurrentPage(() => Math.min(currentPage + 1, totalPages));

  // eslint-disable-next-line
  const prevPage = () => setCurrentPage(() => Math.max(currentPage - 1, 1));

  const validateNewData = (classData, id) => {
    const { className, description } = classData;
    let isValid = true;
    if (className === "") {
      isValid = false;
      toast.warning("Must include Class Name!");
    }
    classes.forEach((each, i) => {
      if (id !== i) {
        if (className === each.className) {
          isValid = false;
          toast.warning("Duplicate data found!");
        }
      } else {
        if (
          className === each.className &&
          description === each.description &&
          !allocating
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
      setNewClass({ ...newClass, [e.target.name]: e.target.value });
    } else if (editing) {
      setOldClass({ ...oldClass, [e.target.name]: e.target.value });
    }
  };

  const onSubmitHandler = (e) => {
    if (adding) {
      if (validateNewData(newClass, classes.length)) {
        addClass(newClass);
        setNewClass({
          className: "",
          description: "",
          students: [],
          attendance: {},
        });
        setAdding(false);
        toast.success("Added successfully.");
      }
    } else if (editing || allocating) {
      if (validateNewData(oldClass, parseInt(oldClassId))) {
        editClass(oldClass, oldClassId);
        setOldClass(null);
        setOldClassId(null);
        setEditing(false);
        setAllocating(false);
        toast.success("Updated successfully.");
      }
    }
  };

  const onDeleteHandler = (id) => {
    deleteClass(id);
    setIdToDelete(null);
    setDeleting(false);
    toast.success("Deleted successfully.");
  };

  const onCheckBoxChangeHandler = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setOldClass({ ...oldClass, students: [...oldClass.students, name] });
    } else {
      setOldClass({
        ...oldClass,
        students: oldClass.students.filter((student) => student !== name),
      });
    }
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
          Class Management Page
          <button
            className={`bg-emerald-400 ml-5 ${styles.actionButtons}`}
            onClick={() => setAdding(true)}
          >
            <UserPlusIcon className="w-8 h-8" />
          </button>
        </h1>
        {!classes.length ? (
          <div className="mt-10">
            <h1 className="animate-bounce">No data to display.</h1>
          </div>
        ) : (
          <div className="overflow-auto w-5/6">
            <table className="w-full table-auto border-separate border-4 border-blue-500 rounded-sm">
              <thead>
                <tr>
                  <th className={styles.tableHeading}>Index</th>
                  <th className={styles.tableHeading}>Class Name</th>
                  <th className={styles.tableHeading}>Description</th>
                  <th className={styles.tableHeading}>Participating No.</th>
                  <th className={styles.tableHeading}>Actions</th>
                </tr>
              </thead>
              <tbody>{Paginate()}</tbody>
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
              New Class Details
            </h1>
            <div className="w-full flex flex-col">
              <input
                className={`${styles.formLayout} p-2`}
                type="text"
                name="className"
                placeholder="Class Name"
                onChange={onChangeHandler}
              />
              <input
                className={`${styles.formLayout} p-2`}
                type="text"
                name="description"
                placeholder="Description"
                onChange={onChangeHandler}
              />

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
              setNewClass({
                className: "",
                description: "",
                students: [],
                attendance: {},
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
              Edit Class Details
            </h1>
            <div className="w-full flex flex-col">
              <input
                className={`${styles.formLayout} p-2`}
                type="text"
                name="className"
                placeholder="Class Name"
                value={oldClass.className}
                onChange={onChangeHandler}
              />
              <input
                className={`${styles.formLayout} p-2`}
                type="text"
                name="description"
                placeholder="Description"
                value={oldClass.description}
                onChange={onChangeHandler}
              />

              <button
                onClick={onSubmitHandler}
                className="bg-emerald-400 w-1/5 p-3 mx-auto my-1 rounded-md sm:text-base text-xs"
              >
                Update
              </button>
            </div>
          </div>
          <div
            onClick={() => setEditing(false)}
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
      {!allocating ? null : (
        <div className="editPrompt">
          <div className={styles.prompts}>
            <div className="h-1/6 flex items-center">
              <h1 className="p-2 text-2xl font-bold border-b-2 border-slate-800">
                Add Participants
              </h1>
              <button
                className={`bg-emerald-400 ml-5 ${styles.actionButtons}`}
                onClick={onSubmitHandler}
              >
                <CheckCircleIcon className="w-8 h-8" />
              </button>
            </div>
            <div className="w-full h-5/6 flex flex-col p-2 overflow-y-auto bg-sky-700 rounded-b-md">
              {students.map((student, i) => (
                <div
                  key={i}
                  className="m-1 p-5 bg-sky-100 rounded-sm flex relative"
                >
                  <h1 className="mx-2">{`${i}. ${
                    student.name.length > 25
                      ? `${student.name.slice(0, 15)}...`
                      : student.name || "N/A"
                  }`}</h1>
                  <div className="absolute top-0 right-0 h-full flex p-4">
                    <input
                      name={i}
                      type="checkbox"
                      defaultChecked={oldClass.students.includes(i.toString())}
                      onChange={onCheckBoxChangeHandler}
                      className="hover:cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            onClick={() => {
              setOldClass(null);
              setOldClassId(null);
              setAllocating(false);
            }}
            className={styles.backButtonDivs}
          >
            <XCircleIcon className={styles.backButtonIcons} />
          </div>
        </div>
      )}
    </>
  );
}
