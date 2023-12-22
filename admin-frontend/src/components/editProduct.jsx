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
} from "@nextui-org/react";
import {BiSolidEdit} from "react-icons/bi"

export default function EditProduct({data}) {
	const [des, setDes] = useState("");
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

	let editProduct = async () => {
		const response = await fetch("http://localhost:1337/edit/product",{
			method: 'PATCH',
			headers: {
				authorization: `Bearer ${localStorage.getItem('authToken')}`
			},
			body: JSON.stringify({
				productId: data.id,
				description: des,
				price: price,
				quantity: quantity
			})
		})
		let res = await response.json();
		if (res.status === 500) {
      toast.warning("server error", {
        position: "top-right",
      });
    } else if (res.status === 200) {
      toast.success(res.message, {
        position: "top-right",
      });
    } else if(res.status === 400) {
			toast.error(res.message,{
				position: 'top-right'
			})
		}
	}
  return (
    <>
			<BiSolidEdit onClick={onOpen} size={22} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center mt-5">
                Edit Product
              </ModalHeader>
              <ModalBody>
                <label htmlFor="des">Description</label>
                <input
                  id="des"
                  type="text"
                  className="border-2 rounded-lg h-14 -mt-2 pl-5"
                  onChange={(e) => {
                    setDes(e.target.value);
                  }}
                />

                <lable htmmlFor="price">Price</lable>
                <input
                  id="price"
                  type="number"
                  className="border-2 rounded-lg h-10 -mt-2 pl-5"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  required
                />
                
                <lable htmlFor="quantity">Quantity</lable>
                <input
                  id="quantity"
                  type="number"
                  className="border-2 rounded-lg h-10 -mt-2 pl-5"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
										editProduct();
									}}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
