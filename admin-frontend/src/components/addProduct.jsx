import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { add } from "../redux/features/products/productSlice";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [file, setFile] = useState();
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [id, setId] = useState();
  const [subId, setSubId] = useState();
  const [des, setDes] = useState();
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let addProduct = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name);
		formData.append("categoryId",id);
		formData.append("price",price);
		formData.append("quantity",quantity);
    subId && formData.append("subCategoryId",subId);
    des && formData.append("description",des);
    const entries = [...formData.entries()]
    console.log(entries,'entries of form data');
    let response = await fetch("http://localhost:1337/addProduct", {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    });
    let res = await response.json();
    if (res.status === 409) {
      toast.error(res.message, {
        position: "top-right",
      });
    } else if (res.status === 500) {
      toast.warning("server error", {
        position: "top-right",
      });
    } else if (res.status === 201) {
      toast.success(res.message, {
        position: "top-right",
      });
      dispatch(add(res.data))
    } else if(res.status === 400) {
			toast.error(res.message,{
				position: 'top-right'
			})
		}
    formData.delete("image");
    formData.delete("name");
		formData.delete("categoryId");
		formData.delete("price");
		formData.delete("quantity");
    subId && formData.delete("subCategoryId");
    des && formData.delete("description");
    const entry = [...formData.entries()];
    console.log(entry,'delete all entry of form data after create');
  };
  let getCategories = async () => {
    let response = await fetch("http://localhost:1337/list/active", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    let res = await response.json();
    setCategory(res.data);
  };
  let getSubCategories = async () => {
    let response = await fetch(`http://localhost:1337/list/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    let res = await response.json();
    if (res.status === 404) {
      setSubCategory([
        {
          name: "select invalid category",
        },
      ]);
    }
    setSubCategory(res.data);
  };
  useEffect(() => {
    getCategories();
  }, [id]);
  return (
    <>
      <Button
        className=" bg-cyan-700 h-12 text-lg text-white p-2 w-40 rounded-lg hover:bg-cyan-800 hover:scale-105"
        onPress={onOpen}
      >
        Add Product
      </Button>
      <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center mt-5">
                Add Product
              </ModalHeader>
              <ModalBody>
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border-2 rounded-lg h-10 -mt-2 pl-5"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required
                />

                <label htmlFor="category">Select Category</label>
                <Select
                  placeholder="Select category"
                  labelPlacement="outside"
                  className="max-w-xl h-10"
                  disableSelectorIconRotation
                  aria-label="category"
                  id="category"
                  name="category"
                >
                  {category.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      onClick={() => {
                        setId(c.id);
                      }}
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>

                <label htmlFor="subCategory">Select SubCategory</label>
                <Select
                  placeholder="Select subCategory"
                  labelPlacement="outside"
                  className="max-w-xl h-10"
                  disableSelectorIconRotation
                  aria-label="subCategory"
                  id="subCategory"
                  name="subCategory"
									onFocus={getSubCategories}
                >
                  {subCategory.map((sc) => (
                    <SelectItem
                      key={sc.id}
                      value={sc.id}
                      onClick={() => {
                        setSubId(sc.id);
                      }}
                    >
                      {sc.name}
                    </SelectItem>
                  ))}
                </Select>

                <label htmlFor="des">Description</label>
                <input
									id="des"
                  name="des"
                  type="text"
                  className="border-2 rounded-lg h-14 -mt-2 pl-5"
                  onChange={(e) => {
                    setDes(e.target.value);
                  }}
                />

                <label htmlFor="price">Price</label>
                <input
									id="price"
                  name="price"
                  type="number"
                  className="border-2 rounded-lg h-10 -mt-2 pl-5"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  required
                />

                <label htmlFor="quantity">Quantity</label>
                <input
									id="quantity"
                  name="quantity"
                  type="number"
                  className="border-2 rounded-lg h-10 -mt-2 pl-5"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
                
                <label htmlFor="file" className="mt-2">
                  Upload Image Of Product:
                </label>
                <input type="file" id="file" required onChange={(e)=> {setFile(e.target.files[0])}} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    addProduct();
                  }}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
