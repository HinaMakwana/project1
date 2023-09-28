import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import DropDownProfile from "../components/dropDownProfile";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import AddProduct from "../components/addProduct";
import DropDown from "../components/dropDown";
import EditProduct from "../components/editProduct";

function Products() {
  let [products, setProducts] = useState([]);
  let [text, setText] = useState("");
  let getProducts = async () => {
    let response = await fetch("http://localhost:1337/listProducts", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    let res = await response.json();
    setProducts(res.data);
  };
  let deleteProduct = async (productId) => {
    let response = await fetch(
      `http://localhost:1337/delete/product/${productId}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
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
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };
  let searchProduct = async () => {
    const response = await fetch(`http://localhost:1337/searchProduct?name=${text}`,{
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    let res = await response.json();
    setProducts(res.data.rows)
  }

  useEffect(() => {
    getProducts();
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
                placeholder="Search product..."
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
                onKeyUp={searchProduct}
              />
              <span className="relative -top-8 left-3 cursor-pointer">
                <BsSearch />
              </span>
            </div>
            <div className=" sm:absolute sm:right-1 md:right-12 lg:right-40 xl:right-24 2xl:right-32">
              <AddProduct />
            </div>
          </div>
          <div>
            <table className="border-collapse table-auto shadow-2xl mx-10 sm:mx-14 mt-5 w-[80vw] xl:w-[85vw] 2xl:w-[87.5vw]">
              <thead>
                <tr className=" bg-cyan-800 border h-14">
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>status</th>
                  <th>Change status</th>
									<th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr
                      className=" even:bg-cyan-100 hover:bg-cyan-200 h-14 hover:shadow-2xl"
                      key={product.id}
                    >
                      <td className="flex justify-center">
                        <img src={product.imageUrl} className="h-5" />
                      </td>
                      <td
                        className="text-center cursor-pointer"
                      >
                        {product.name}
                      </td>
                      <td className="text-center">{product.price}</td>
                      <td className="text-center">{product.quantity}</td>
                      <td
                        style={{
                          color: product.status === "Active" ? "green" : "red",
                        }}
                        className="text-center"
                      >
                        {product.status}
                      </td>
                      <td className=" flex justify-center pt-5">
                        <DropDown data={product} />
                      </td>
											<td className="cursor-pointer">
												<EditProduct data={product} />
											</td>
                      <td
                        onClick={() => {
                          deleteProduct(product.id);
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

export default Products;
