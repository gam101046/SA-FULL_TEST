import { BrowserRouter as Router } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomeMember from "./pages/Home/Member/homemember";
// import HomeSeller from "./pages/Home/Seller/homeseller";

// import ApplyToSeller from "./pages/Products/ApplyToSeller/ApplyToSeller";
// import EditProducts from "./pages/Products/EditProducts/EditProducts";
// import MyProducts from "./pages/Products/MyProducts/MyProducts";
// import CreateProducts from "./pages/Products/CreateProducts/CreateProducts";

import ConfigRoutes from "./routes";

function App() {
  return (
    <div className="App">
      <Router>
        <ConfigRoutes/>
        {/* <Routes> */}
          {/* <Route path="/" element={<ConfigRoutes />} /> */}
          {/* <Route path="/HomeMember" element={<HomeMember />} />
          <Route path="/createproducts" element={<CreateProducts />} />    
          <Route path="/apply-to-seller" element={<ApplyToSeller />} />    
          <Route path="/SellerHome" element={<HomeSeller />} />  
          <Route path="/createproducts" element={<CreateProducts />} />  
          <Route path="/MyProducts" element={<MyProducts />} />
          <Route path="/editproducts" element={<EditProducts />} /> */}

        {/* </Routes> */}
      </Router>
    </div>
  );
}

export default App;
