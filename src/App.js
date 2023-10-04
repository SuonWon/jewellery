import { Route, Routes } from "react-router-dom";
import Login from "./login";
import Nav from "./components/nav_component";
import Setup from "./components/setup";
import Customer from "./pages/customer";
import Supplier from "./pages/supplier";
import StoneDetails from "./pages/stone_details";
import PurchaseInvoice from "./pages/purchase_invoice";
import PurchaseList from "./pages/purchase_list";
import PurchaseEdit from "./pages/purchase_edit";
import { RequireAuth } from "react-auth-kit";



function App() {
  return (
    <div className="flex flex-col justify-center">
      {
        window.location.pathname === "/" ? "" : <Nav />
      }
      <div className="flex items-center justify-center">
        <Routes>
          <Route path="/" element={
            <RequireAuth loginPath="/login">

            </RequireAuth>
          }></Route>
          <Route path="master/*" element={
              <Setup />
          }></Route>
          <Route path="customer" element={<Customer />}></Route>
          <Route path="supplier" element={<Supplier />}></Route>
          <Route path="stone_details" element={<StoneDetails />}></Route>
          <Route path="purchase_list" element={<PurchaseList />}></Route>
          <Route path="purchase_invoice" element={<PurchaseInvoice />}></Route>
          <Route path="purchase_edit/:puId" element={<PurchaseEdit />}></Route>
          <Route path="login" element={<Login />}></Route>
        </Routes>
      </div>
    </div>
  );
}



export default App;
