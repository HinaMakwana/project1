import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import Dashboard from "./pages/dashboard";
import Products from "./pages/products";
import Users from "./pages/users";
import Categories from "./pages/categories";
import MyViewProvider from "./context/myViewProvider";
import { ToastContainer } from "react-toastify";
import SubCategory from "./pages/subCategory";

function App() {

  return (
    <MyViewProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/subCategory" element={<SubCategory />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </MyViewProvider>
  );
}

export default App;
