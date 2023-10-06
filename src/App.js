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

import SalesInvoice from "./pages/sales_invoice";
import SalesList from "./pages/sales_list";


function App() {
  return (
    <div className="flex flex-col justify-center">
      {/* {
        window.location.pathname === "/login" ? "" : <Nav />
      } */}
      <Nav />
      <div className="flex items-center justify-center">
        <Routes>
          <Route path="/" element={
            <RequireAuth loginPath="/login">
            </RequireAuth>
          }></Route>
          <Route path="master/*" element={
            <RequireAuth loginPath="/login">
              <Setup />
            </RequireAuth>
          }></Route>
          <Route path="customer" element={
            <RequireAuth loginPath="/login">
              <Customer />
            </RequireAuth>
          }></Route>
          <Route path="supplier" element={
            <RequireAuth loginPath="/login">
              <Supplier />
            </RequireAuth>
          }></Route>
          <Route path="stone_details" element={
            <RequireAuth loginPath="/login">
              <StoneDetails />
            </RequireAuth>
          }>
          </Route>
          <Route path="purchase_list" element={
            <RequireAuth loginPath="/login">
              <PurchaseList />
            </RequireAuth>
          }></Route>
          <Route path="purchase_invoice" element={
            <RequireAuth loginPath="/login">
              <PurchaseInvoice />
            </RequireAuth>
          }></Route>
          <Route path="purchase_edit/:puId" element={
            <RequireAuth loginPath="/login">
              <PurchaseEdit />
            </RequireAuth>
          }></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </div>
  );
}



export default App;
