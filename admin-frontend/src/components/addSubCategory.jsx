import React, { useState } from "react";
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
  Input,
} from "@nextui-org/react";

export default function AddSubCategory({ id }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let addSubCategory = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name);
    formData.append("categoryId", id);
    let response = await fetch("http://localhost:1337/add/subCategory", {
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
    } else if (res.status === 400) {
      toast.warning(res.message, {
        position: "top-right",
      });
    } else if (res.status === 201) {
      toast.success(res.message, {
        position: "top-right",
      });
    }
  };
  return (
    <>
      <Button
        className=" bg-cyan-700 h-12 text-lg text-white p-2 w-40 rounded-lg hover:bg-cyan-800 hover:scale-105"
        onPress={onOpen}
      >
        Add subCategory
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center mt-5">
                Add Subcategory
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  placeholder="Enter Category Name"
                  variant="bordered"
                  name="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required
                />
                <Input
                  autoFocus
                  type="file"
                  variant=""
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    addSubCategory();
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
