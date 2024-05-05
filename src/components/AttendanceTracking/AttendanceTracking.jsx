import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuth } from "../../AuthContext";
import "../../globals.css";
import { toast } from "react-toastify";

export default function AttendanceTracking() {
  const { classes, editClass, students } = useAuth();

  const [checking, setChecking] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [currentClassId, setCurrentClassId] = useState(null);
  const [attended, setAttended] = useState([]);
  const [date, setDate] = useState(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [expanded, setExpanded] = useState(false);

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
              setCurrentClass(each);
              setCurrentClassId(i);
              setAttended(each.attendance[dateFormatter(date)] || []);
              setChecking(true);
            }}
            className={`bg-fuchsia-400 ${styles.actionButtons}`}
          >
            <CalendarDaysIcon className="w-5 h-5" />
          </button>
        </td>
      </tr>
    ));
  };

  const nextPage = () =>
    setCurrentPage(() => Math.min(currentPage + 1, totalPages));

  // eslint-disable-next-line
  const prevPage = () => setCurrentPage(() => Math.max(currentPage - 1, 1));

  const dateFormatter = (date) =>
    `${date.slice(8)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;

  const onDateChangeHandler = (e) => {
    setDate(e.target.value);
    setAttended(currentClass.attendance[dateFormatter(e.target.value)] || []);
  };

  const onCheckBoxChangeHandler = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setAttended([...attended, name]);
    } else {
      setAttended(attended.filter((student) => student !== name));
    }
  };

  const onSubmitHandler = () => {
    const updatedClass = {
      ...currentClass,
      attendance: { ...currentClass.attendance },
    };
    updatedClass.attendance[dateFormatter(date)] = attended;
    editClass(updatedClass, currentClassId);
    setCurrentClass(null);
    setCurrentClassId(null);
    setAttended([]);
    setDate(() => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    setExpanded(false);
    setChecking(false);
    toast.success("Updated successfully.");
  };

  const styles = {
    tableHeading: "border border-sky-700 rounded-sm p-2 bg-sky-500",
    tableData: "border border-sky-500 rounded-sm p-2 bg-sky-100 text-center",
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

  return (
    <>
      <div className="h-5/6 p-4 flex flex-col items-center relative">
        <h1 className="sm:text-2xl text-sm my-5 font-bold flex items-center">
          Attendance Tracking Page
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
      {!checking ? null : (
        <div className="editPrompt">
          <div className={styles.prompts}>
            <div className="h-1/6 flex items-center">
              <button
                onClick={onSubmitHandler}
                className={`bg-emerald-400 ml-5 ${styles.actionButtons}`}
              >
                <CheckCircleIcon className="w-8 h-8" />
              </button>
              <h1 className="p-2 sm:text-2xl text-xs font-bold border-b-2 border-slate-800">
                Attendance Checking
              </h1>

              <button className="bg-violet-400 mr-5 relative p-2 m-2 rounded-md">
                <ClockIcon
                  onClick={() => setExpanded(!expanded)}
                  className="w-8 h-8 transition ease hover:scale-125"
                />
                {!expanded ? null : (
                  <div className="absolute right-0 z-10 mt-2 p-1 bg-white rounded-md border border-slate-700">
                    <input
                      name="date"
                      defaultValue={date}
                      type="date"
                      onChange={onDateChangeHandler}
                      className="z-20"
                    />
                  </div>
                )}
              </button>
            </div>
            <div className="w-full h-5/6 flex flex-col p-2 overflow-y-auto bg-sky-700 rounded-b-md">
              {students.map((student, i) => {
                return currentClass.students.includes(i.toString()) ? (
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
                      <>
                        <input
                          name={i}
                          type="checkbox"
                          checked={attended.includes(i.toString())}
                          onChange={onCheckBoxChangeHandler}
                          className="hover:cursor-pointer"
                        />
                      </>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div
            onClick={() => {
              setCurrentClass(null);
              setCurrentClassId(null);
              setAttended([]);
              setDate(() => {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = (currentDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const day = currentDate.getDate().toString().padStart(2, "0");
                return `${year}-${month}-${day}`;
              });
              setExpanded(false);
              setChecking(false);
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
