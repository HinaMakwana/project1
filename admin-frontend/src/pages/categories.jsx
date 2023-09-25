import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import DropDownProfile from "../components/dropDownProfile";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Categories() {
  let [categories, setCategory] = useState([]);
  let [text, setText] = useState("");

  let getCategories = async () => {
    let response = await fetch("http://localhost:1337/listCategories", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    let res = await response.json();
    setCategory(res.data);
  };
  let deleteCategory = async (id) => {
    let response = await fetch(`http://localhost:1337/delete/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    let res = await response.json();
    if (res.status === 404) {
      toast.error(res.message, {
        position: "top-right",
      });
    } else if (res.status === 400) {
      toast.warning(res.message, {
        position: "top-right",
      });
    } else if (res.status === 200) {
      toast.success(res.message, {
        position: "top-right",
      });
      setCategory((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div>
        <div className="pt-5">
          <DropDownProfile />
        </div>
        <div className="pt-10">
          <div className="flex mt-10">
            <div className="absolute right-70 ml-20">
              <input
                type="text"
                className=" p-2 h-11 border border-slate-300 rounded-md w-[500px] outline-none transition-colors ease-in-out duration-1000 focus:border-cyan-700"
                placeholder="search category..."
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
              />
              <span className=" absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                <BsSearch />
              </span>
            </div>
            <div className="absolute right-[90px]">
              <button className=" bg-cyan-700 h-11 text-white p-2 w-40 rounded-lg hover:bg-cyan-800 hover:scale-110">
                Add category
              </button>
            </div>
          </div>
          <div>
            <table
              className="border-collapse table-auto shadow-2xl m-20"

            >
              <thead>
                <tr className=" bg-cyan-800 border text-left h-14">
                  <th className="pl-10">Image</th>
                  <th>Name</th>
                  <th className="">No of Products</th>
                  <th className="pl-10">status</th>
                  <th>Change status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  return (
                    <tr
                      className=" even:bg-cyan-100 hover:bg-cyan-200 h-14"
                      key={category.id}
                    >
                      <td className="pl-10">
                        <img src={category.Image} className="h-5" />
                      </td>
                      <td>{category.name}</td>
                      <td>{category.No_Products}</td>
                      <td
                        style={{
                          color: category.status === "Active" ? "green" : "red",
                        }}
                        className="pl-10"
                      >
                        {category.status}
                      </td>
                      <td className="pl-10">
                        <BsThreeDotsVertical />
                      </td>
                      <td
                        onClick={() => {
                          deleteCategory(category.id);
                        }}
                      >
                        <MdDeleteOutline
                          size={25}
                          className="hover:text-red-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
