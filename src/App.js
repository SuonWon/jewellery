import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./login";
import Nav from "./components/nav_component";
import Setup from "./components/setup";
import Customer from "./pages/customer";
import Supplier from "./pages/supplier";
import StoneDetails from "./pages/stone_details";
import PurchaseList from "./pages/purchase_list";
import { RequireAuth } from "react-auth-kit";
import SalesList from "./pages/sales_list";
import ReturnList from "./pages/return_list";
import StoneSelection from "./pages/stone_selection";
import IssueList from "./pages/issue_list";
import Dashboard from "./pages/dashboard";
import Share from "./pages/share";
import Damage from "./pages/damage";
import Wallet from "./pages/wallet";
import Adjustment from "./pages/adjustment";
import { useFetchWalletQuery } from "./store";


function App() {

  const {data : walletData } = useFetchWalletQuery();

  const currentUrl = useLocation();

  return (
    <div className="flex flex-col justify-center">

      {
        currentUrl.pathname === "/login" ? "" : <Nav />
      }
      <div className="flex items-center justify-center">
        <Routes>
          <Route path="/" element={
            <RequireAuth loginPath="/login">
              <Dashboard />
            </RequireAuth>
          }></Route>
          <Route path="/dashboard" element={
            <RequireAuth loginPath="/login">
              <Dashboard />
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
          <Route path="share" element={
            <RequireAuth loginPath="/login">
              <Share />
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
          <Route path="sales_list" element={
            <RequireAuth loginPath="/login">
              <SalesList />
            </RequireAuth>
          }></Route>
          <Route path="return_list" element={
            <RequireAuth loginPath="/login">
              <ReturnList />
            </RequireAuth>
          }></Route>
          <Route path="stone_selection" element={
            <RequireAuth loginPath="/login">
              <StoneSelection />
            </RequireAuth>
          }></Route>
          <Route path="issue_list" element={
            <RequireAuth loginPath="/login">
              <IssueList />
            </RequireAuth>
          }></Route>
          <Route path="damage" element={
            <RequireAuth loginPath="/login">
              <Damage />
            </RequireAuth>
          }></Route>
          <Route path="adjustment" element={
            <RequireAuth loginPath="/login">
              <Adjustment />
            </RequireAuth>
          }></Route>
          <Route path="wallet" element={
            <RequireAuth loginPath="/login">
              <Wallet 
                walletId={walletData?.find(el => el.share.isOwner === true).id}
              />
            </RequireAuth>
          }></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </div>
  );
}



export default App;
