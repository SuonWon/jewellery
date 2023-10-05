import { Route, Routes } from "react-router-dom";
// import Login from "./login";
import Nav from "./components/nav_component";
import Setup from "./components/setup";
import Customer from "./pages/customer";
import Supplier from "./pages/supplier";
import StoneDetails from "./pages/stone_details";
import PurchaseInvoice from "./pages/purchase_invoice";
import PurchaseList from "./pages/purchase_list";
import PurchaseEdit from "./pages/purchase_edit";
import SalesInvoice from "./pages/sales_invoice";
import SalesList from "./pages/sales_list";


function App() {
  return (
    <div className="flex flex-col justify-center">
      <Nav />
      <div className="flex items-center justify-center">
        <Routes>
          <Route path="master/*" element={<Setup />}></Route>
          <Route path="customer" element={<Customer />}></Route>
          <Route path="supplier" element={<Supplier />}></Route>
          <Route path="stone_details" element={<StoneDetails />}></Route>
          <Route path="purchase_list" element={<PurchaseList />}></Route>
          <Route path="purchase_invoice" element={<PurchaseInvoice />}></Route>
          <Route path="purchase_edit/:puId" element={<PurchaseEdit />}></Route>
          {/* <Route path="login" element={<Login />}></Route> */}
          <Route path="sales_invoice" element={<SalesInvoice/>}></Route>
          <Route path="sales_list" element={<SalesList/>}></Route>
          {/* <Route path="login" element={<Login />}></Route> */}
        </Routes>
      </div>
    </div>
  );
}



export default App;
