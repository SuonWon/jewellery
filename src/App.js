import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login";
import Nav from "./components/nav_component";
import Setup from "./components/setup";
import Customer from "./pages/customer";
import Supplier from "./pages/supplier";
import StoneDetails from "./pages/stone_details";
import PurchaseList from "./pages/purchase_list";
import { RequireAuth, useAuthUser } from "react-auth-kit";
import SalesList from "./pages/sales_list";
import ReturnList from "./pages/return_list";
import StoneSelection from "./pages/stone_selection";
import IssueList from "./pages/issue_list";
import Dashboard from "./pages/dashboard";
import Share from "./pages/share";
import Damage from "./pages/damage";
import Wallet from "./pages/wallet";
import Adjustment from "./pages/adjustment";
import WalletList from "./pages/walletList";
import SystemUser from "./pages/systemUser";
import SystemRole from "./pages/systemRole";
import { AuthContent } from "./context/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "./const";
import Cookies from "js-cookie";
import NoPermission from "./pages/noPermission";
import Home from "./pages/home";
import CashClosing from "./pages/cash_closing";
import Closing from "./pages/closing";
import ClosingPreview from "./pages/closing_preview";


function App() {

  const auth = useAuthUser();

  const [permissions, setPermissions] = useState([]);

  // const filterData = {
  //   skip: 0,
  //   take: 0,
  //   search: ''
  // }
  // const {data : walletData } = useFetchWalletQuery(filterData);

  const currentUrl = useLocation();

  useEffect(() => {
    if (permissions.length === 0 && auth() !== null) {
      axios.get(`${apiUrl}/system-user/get-user-role/${auth().username}`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get('_auth')}`}
      }).then((res) => {
        setPermissions(res.data.permissions);
      })
    }
  }, [permissions.length, auth])

  return (
    <AuthContent.Provider value={{permissions, setPermissions}}>
      <div className="flex flex-col justify-center w-full">
        {
          currentUrl.pathname === "/login" || currentUrl.pathname === "/closing_preview" ? "" : <Nav />
        }
        <div className="flex items-center justify-center w-full">
          <Routes>
            <Route path="/" element={
              <RequireAuth loginPath="/login">
                {/* <Dashboard /> */}
                {/* <Setup /> */}
                <Home />
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
            <Route path="issue_return" element={
              <RequireAuth loginPath="/login">
                <ReturnList type="I" />
              </RequireAuth>
            }></Route>
            <Route path="sales_return" element={
              <RequireAuth loginPath="/login">
                <ReturnList type="S" />
              </RequireAuth>
            }></Route>
            <Route path="purchase_return" element={
              <RequireAuth loginPath="/login">
                <ReturnList type="P" />
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
                  // walletId={walletData?.find(el => el.share.isOwner === true).id}
                />
              </RequireAuth>
            }></Route>
            <Route path="cash_closing" element={
              <RequireAuth loginPath="/login">
                <CashClosing />
              </RequireAuth>
            }></Route>
            <Route path="closing" element={
              <RequireAuth loginPath="/login">
                <Closing />
              </RequireAuth>
            }></Route>
            <Route path="closing_preview" element={
              <RequireAuth loginPath="/login">
                <ClosingPreview />
              </RequireAuth>
            }></Route>
            <Route path="wallet_list" element={
              <RequireAuth loginPath="/login">
                <WalletList />
              </RequireAuth>
            }></Route>
            <Route path="system_user" element={
              <RequireAuth loginPath="/login">
                <SystemUser />
              </RequireAuth>
            }></Route>
            <Route path="system_role" element={
              <RequireAuth loginPath="/login">
                <SystemRole />
              </RequireAuth>
            }></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="403" element={
              <RequireAuth loginPath="/login">
                <NoPermission />
              </RequireAuth>
            }></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </div>
      </div>
    </AuthContent.Provider>
  );
}



export default App;
