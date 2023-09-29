import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { edit } from "../redux/features/categories/categorySlice";
import { editData } from "../redux/features/subCategory/subCategorySlice";
import { changeStatus } from "../redux/features/products/productSlice";

function DropDown({ data }) {
  const dispatch = useDispatch();
  let url;
  let editCategory = async (status) => {
    if (data.category) {
      url = "http://localhost:1337/edit/subCategory";
    } else if (data.categoryId) {
      url = "http://localhost:1337/changeStatus";
    } else {
      url = "http://localhost:1337/edit";
    }
    let response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({
        id: data.id,
        status: status,
      }),
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
      dispatch(edit(res.data));
      dispatch(editData(res.data));
      dispatch(changeStatus(res.data));
    }
  };
  return (
    <div>
      <Dropdown placement="bottom-start" className="bg-cyan-50">
        <DropdownTrigger>
          <button className="focus:ring-0 focus:outline-none">
            <BsThreeDotsVertical />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" className="h-24">
          <DropdownItem
            key="new"
            className="text-green-600"
            onClick={() => {
              editCategory("Active");
            }}
          >
            Active
          </DropdownItem>
          <DropdownItem
            key="copy"
            className="text-red-600"
            onClick={() => {
              editCategory("Inactive");
            }}
          >
            Inactive
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default DropDown;
