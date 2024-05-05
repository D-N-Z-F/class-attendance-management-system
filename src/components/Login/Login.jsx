import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import "../../globals.css";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState("");

  const onChangeHandler = (e) => setUserData(e.target.value);

  const loginHandler = () => {
    if (userData === "") {
      toast.warning("Please enter your username!");
    } else {
      login(userData);
      toast.success("Logged in successfully.");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <div className="h-full flex justify-center">
        <div className="container mx-auto flex flex-col justify-center items-center">
          <h1 className="text-blue-700 text-2xl font-semibold flex items-center mb-3">
            LOGIN
            <ArrowLeftEndOnRectangleIcon className="ml-1 w-8 h-8" />
          </h1>
          <div className="columns-1 rounded-md bg-blue-50 p-4">
            <div className="flex flex-col">
              <label className="block">
                <span className="block lato-regular">Username</span>
                <input
                  type="text"
                  placeholder="e.g. johndoe123"
                  onChange={onChangeHandler}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-lg placeholder-slate-400
                  focus:outline-none focus:border-sky-300 focus:ring-1 focus:ring-sky-300 focus:scale-105 transition ease"
                />
              </label>
              <button
                onClick={loginHandler}
                className="loginBtn loginBtnHover text-slate-500 hover:text-blue-400"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
