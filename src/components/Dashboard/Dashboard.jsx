import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "../../globals.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const styles = {
    mainDiv:
      "h-5/6 p-4 grid grid-cols-2 sm:grid-rows-2 grid-rows-3 grid-flow-row grid-flow-col gap-4 flex justify-center items-center",
    sectionDivs:
      " gradient-holder h-full bg-sky-400 rounded-md flex justify-center items-center",
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <div className={styles.mainDiv}>
        <div
          className={`sm:row-span-2 sm:col-span-1 col-span-2 ${styles.sectionDivs}`}
          onClick={() => navigate("/SPM")}
        >
          <h1 className="gradient-text lg:text-5xl sm:text-2xl">
            Student Profile Management
          </h1>
        </div>
        <div
          className={`col-span-2 ${styles.sectionDivs}`}
          onClick={() => navigate("/CM")}
        >
          <h1 className="gradient-text lg:text-5xl sm:text-2xl">
            Class Management
          </h1>
        </div>
        <div
          className={`col-span-2 ${styles.sectionDivs}`}
          onClick={() => navigate("/AT")}
        >
          <h1 className="gradient-text lg:text-5xl sm:text-2xl">
            Attendance Tracking
          </h1>
        </div>
      </div>
    </>
  );
}
