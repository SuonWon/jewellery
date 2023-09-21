import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Nav from "./components/nav_component";
import Setup from "./components/setup";
import Customer from "./pages/customer";



function App() {
  return (
    <div className="flex flex-col justify-center">
      <Nav />
      <Routes>
        <Route path="master/*" element={<Setup />}></Route>
        <Route path="customer" element={<Customer />}></Route>
        <Route path="login" element={<Login />}></Route>
      </Routes>
    </div>
  );
}



export default App;
