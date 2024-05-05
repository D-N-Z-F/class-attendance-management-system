import {
  ArrowLeftStartOnRectangleIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const checkAndNavigate = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const logoutHandler = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully.");
  };

  const styles = {
    navbar: "h-1/6 w-full px-4 bg-sky-600 flex justify-center items-center",
    title:
      "text-center text-sky-100 text-2xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-md cursor-pointer drop-shadow-2xl",
    navbarDivs: "md:w-12 md:h-12 sm:w-8 sm:h-8 w-6 h-6 sm:mx-4 mx-2 relative",
    navbarIcons:
      "rounded-md transition cursor-pointer text-sky-100 hover:absolute hover:scale-125 hover:bg-blue-500 hover:text-sky-900",
    settingIcon:
      "w-12 h-12 rounded-md transition cursor-pointer text-sky-100 hover:scale-105 hover:bg-blue-500 hover:text-sky-900",
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className="w-full flex justify-evenly items-center">
          <h1
            className={`sm:block hidden ${styles.title}`}
            onClick={() => checkAndNavigate("/")}
          >
            CAMS
          </h1>
          <h1
            className={`sm:hidden block ${styles.title}`}
            onClick={() => checkAndNavigate("/")}
          >
            <HomeIcon className="w-5 h-5" />
          </h1>
          <div className="flex flex-row justify-center items-center w-5/6">
            <div
              className={styles.navbarDivs}
              onClick={() => checkAndNavigate("/SPM")}
            >
              <UserCircleIcon
                className={`${styles.navbarIcons}${
                  location.pathname === "/SPM"
                    ? "absolute scale-125 bg-blue-500 text-sky-900"
                    : ""
                }`}
              />
            </div>
            <div
              className={styles.navbarDivs}
              onClick={() => checkAndNavigate("/CM")}
            >
              <BookOpenIcon
                className={`${styles.navbarIcons}${
                  location.pathname === "/CM"
                    ? "absolute scale-125 bg-blue-500 text-sky-900"
                    : ""
                }`}
              />
            </div>
            <div
              className={styles.navbarDivs}
              onClick={() => checkAndNavigate("/AT")}
            >
              <CalendarDaysIcon
                className={`${styles.navbarIcons}${
                  location.pathname === "/AT"
                    ? "absolute scale-125 bg-blue-500 text-sky-900"
                    : ""
                }`}
              />
            </div>
          </div>
          <ArrowLeftStartOnRectangleIcon
            onClick={logoutHandler}
            className={styles.settingIcon}
          />
        </div>
      </nav>
    </>
  );
}
