import React, { useContext } from "react";
import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiPackage, FiCircle } from "react-icons/fi";
import { FaRegDotCircle } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { TbHomeSignal } from "react-icons/tb";
import { NavLink } from "react-router-dom";

import MyContext from "../context/myContext";

function Sidebar() {
  const menuItem = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <TbHomeSignal size={20} />,
    },
    {
      path: "/categories",
      name: "Categories",
      icon: <RxDashboard size={20} />,
    },
    {
      path: "/products",
      name: "Products",
      icon: <FiPackage size={20} />,
    },
    {
      path: "/orders",
      name: "Orders",
      icon: <HiOutlineShoppingCart size={20} />,
    },
    {
      path: "/users",
      name: "Users",
      icon: <FiUsers size={20} />,
    },
  ];
  const context = useContext(MyContext);
  const { changeView, view } = context;

  return (
    <div className="flex">
      <div className=" h-[100vh] text-white bg-gradient-to-tr from-cyan-700 via-cyan-600 to-cyan-800 transition-all duration-1000" style={{width : view ? "280px" : "55px"}}>
        <div className="flex items-center px-[5px] py-[15px]">
          {/* <img src="logo.png" className="h-20 mix-blend-multiply transition-all duration-700" style={{display: view ? "block" : "none"}} /> */}
          <div
            className="flex text-xl mt-5 transition-all duration-700"
            onClick={changeView}
            style={{marginLeft: view ? "130px" : "15px"}}
          >
            {view ? <FaRegDotCircle style={{ marginLeft: '70px'}}/> : <FiCircle />}
          </div>
        </div>
        <div className="mt-5">
          {menuItem.map((items, index) => (
            <NavLink
              to={items.path}
              key={index}
              className="flex text-white px-[10px] py-[15px] gap-[15px] transition-all duration-1000 hover:bg-cyan-600 hover:transition-all hover:duration-800"
            >
              <div className="mt-1 transition-all duration-700" style={{marginLeft: view ? "60px" : "10px"}}>{items.icon}</div>
              <div className=" text-lg transition-all duration-1000" style={{display: view ? "block" : "none"}}>{items.name}</div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
