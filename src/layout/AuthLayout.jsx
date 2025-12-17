import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";



const AuthLayout = () => {
  return (
    <div className=" ">
      <header className="">
        <Navbar/>
      </header>
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;