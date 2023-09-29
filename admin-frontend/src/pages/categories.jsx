import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import DropDownProfile from "../components/dropDownProfile";
import { MdDeleteOutline } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import DropDown from "../components/dropDown";
import AddCategory from "../components/addCategory";
import { useDispatch, useSelector } from "react-redux";
import { getCategory, remove, search } from "../redux/features/categories/categorySlice";

function Categories() {
  let [text, setText] = useState("");
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let categories = useSelector(state => state.category.data)
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
      dispatch(remove({id: id}))
    }
  };
  let searchCategory = async () => {
    let response = await fetch(`http://localhost:1337/search?title=${text}`,{
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    let res = await response.json();
    dispatch(search(res.data.rows))
  };

  useEffect(() => {
    dispatch(getCategory())
  }, []);
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div>
        <div className="py-3 mt-10 rounded-lg mx-10 sm:mx-14 shadow-2xl px-10 flex justify-end">
          <DropDownProfile />
        </div>
        <div className="pt-10">
          <div className="mx-10 sm:mx-14 flex-row sm:flex">
            <div className="">
              <input
                type="text"
                className=" p-2 px-10 h-12 border border-slate-300 rounded-md w-[400px] sm:w-[335px] md:w-[400px] lg:w-[500px] xl:w-[700px] outline-none transition-colors ease-in-out duration-1000 focus:border-cyan-700"
                placeholder="Search category..."
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
                onKeyUp={searchCategory}
              />
              <span className="relative -top-8 left-3 cursor-pointer">
                <BsSearch />
              </span>
            </div>
            <div className=" sm:absolute sm:right-1 md:right-12 lg:right-40 xl:right-24 2xl:right-32">
              <AddCategory />
            </div>
          </div>
          <div>
            <table className="border-collapse table-auto shadow-2xl mx-10 sm:mx-14 mt-5 w-[80vw] xl:w-[85vw] 2xl:w-[87.5vw]">
              <thead>
                <tr className=" bg-cyan-800 border h-14">
                  <th>Image</th>
                  <th>Name</th>
                  <th>No of Products</th>
                  <th>status</th>
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
                      <td className="flex justify-center">
                        <img src={category.Image} className="h-5" />
                      </td>
                      <td
                        className="text-center cursor-pointer"
                        onClick={() => {
                          navigate(`/${category.name}/subCategory`, {
                            replace: false,
                            state: { id: category.id },
                          });
                        }}
                      >
                        {category.name}
                      </td>
                      <td className="text-center ">{category.No_Products}</td>
                      <td
                        style={{
                          color: category.status === "Active" ? "green" : "red",
                        }}
                        className="text-center"
                      >
                        {category.status}
                      </td>
                      <td className=" flex justify-center pt-5">
                        <DropDown data={category} />
                      </td>
                      <td
                        onClick={() => {
                          deleteCategory(category.id);
                        }}
                        className=" cursor-pointer"
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
