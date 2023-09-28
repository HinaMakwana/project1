import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DropDown({ data }) {
  let [status, setStatus] = useState("Active");
  let url;
  let editCategory = async () => {
    if (data.category) {
      url = "http://localhost:1337/edit/subCategory"
    } else if(data.categoryId) {
      url = "http://localhost:1337/changeStatus"
    } else {
      url = "http://localhost:1337/edit"
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
            onClick={()=>{editCategory()}}
            onPress={() => {
              setStatus("Active");
            }}
          >
            Active
          </DropdownItem>
          <DropdownItem
            key="copy"
            className="text-red-600"
            onClick={()=>{editCategory()}}
            onPress={() => {
              setStatus("Inactive");
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
