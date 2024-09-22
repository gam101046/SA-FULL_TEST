// import { lazy } from "react";

// import { RouteObject } from "react-router-dom";
// import Loadable from "../component/Loadable";
// import LoginPage from "../pages/authentication/Login/Login";
// import Profile from "../pages/authentication/Member/Profile";
// import MyProducts from "../pages/Products/MyProducts/MyProducts";
// import Buyproduct from "../pages/Products/Buy-Products/BuyProducts";
// import  Order  from "../pages/Products/Orders/Orders";
// import PurchaseList from "../pages/Products/Purchase-list/PurchaseList"
// import FullLayout from "../Layout/FullLayout";
// import ChatBuyer from "../pages/Chat/MemberChat/ChatBuyer"
// import ChatSeller from "../pages/Chat/SellerChat/ChatSeller"
// // import ApplyToSeller from "../pages/Products/ApplyToSeller/ApplyToSeller";


// const MainPages = Loadable(lazy(() => import("../../src/pages/Home/home")));

// // const HomeLogin = Loadable(lazy(() => import("../../src/pages/HomeLogin/homelogin")));
// const HomeMember = Loadable(lazy(() => import("../pages/Home/Member/homemember")));
// const HomeSeller = Loadable(lazy(() => import("../pages/Home/Seller/homeseller")));
// const CreateProducts = Loadable(lazy(() => import("../pages/Products/CreateProducts/CreateProducts")));
// const ApplyToSeller = Loadable(lazy(() => import("../pages/Products/ApplyToSeller/ApplyToSeller")));
// const ProfileEdit = Loadable(lazy(() => import("../../src/pages/authentication/Member/edit/ProfileEdit")));


// const MemberRoutes = (isLoggedIn: boolean): RouteObject[] => {
//   return [
//     {
//       path: "/",
//       element: isLoggedIn ? <FullLayout  /> : <MainPages />,
//     },
//     {
//       path: "/HomeMember",
//       element: <HomeMember />,
//     },
  
//     {
//       path: "/Login",
//       element: <LoginPage />,
//     },
//     {
//       path: "/apply-to-seller",
//       element: <ApplyToSeller />,
//     },
//     {
//       path: "/HomeSeller",
//       element: <HomeSeller />,
//     },
//     {
//       path: "/createproducts",
//       element: <CreateProducts />,
//     },

//     {
//       path: "/MyProducts",
//       element: <MyProducts />,
//     },

//     {
//       path: "/Profile",
//       element: <Profile />,
//     },
//     {
//       path: "/Profile/ProfileEdit/:id",
//       element: <ProfileEdit />,
//     },
//     {
//       path: "/BuyProduct/:id",
//       element: <Buyproduct />,
//     },
//     {
//       path: "/MyOrder",
//       element: <PurchaseList />,
//     },
//     {
//       path: "/Card",
//       element: <Order />,
//     },
//     {
//       path: "/ChatBuyer",
//       element: <ChatBuyer />,
//     },
//     {
//       path: "/ChatSeller",
//       element: <ChatSeller />,
//     },
//     {
//       path: "*",
//       element: <HomeMember />,
//     },
//   ];
// };

// export default MemberRoutes;




import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../component/Loadable";
import ChatBuyer from "../pages/Chat/MemberChat/ChatBuyer";
import ChatSeller from "../pages/Chat/SellerChat/ChatSeller";
import Buyproduct from "../pages/Products/Buy-Products/BuyProducts";
import MyProducts from "../pages/Products/MyProducts/MyProducts";
import Order from "../pages/Products/Orders/Orders";
import PurchaseList from "../pages/Products/Purchase-list/PurchaseList";
import LoginPage from "../pages/authentication/Login/Login";
import Profile from "../pages/authentication/Member/Profile";
import SearchProducts from "../pages/Products/SearchProducts/searchproducts"

const MainPages = Loadable(lazy(() => import("../../src/pages/Home/home")));
const HomeMember = Loadable(lazy(() => import("../pages/Home/Member/homemember")));
const HomeSeller = Loadable(lazy(() => import("../pages/Home/Seller/homeseller")));
const CreateProducts = Loadable(lazy(() => import("../pages/Products/CreateProducts/CreateProducts")));
const ApplyToSeller = Loadable(lazy(() => import("../pages/Products/ApplyToSeller/ApplyToSeller")));
const ProfileEdit = Loadable(lazy(() => import("../../src/pages/authentication/Member/edit/ProfileEdit")));

const MemberRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: "/",
      element: isLoggedIn ? <HomeMember /> : <MainPages />,
    },
    {
      path: "/HomeMember",
      element: <HomeMember />,
    },
    {
      path: "/Login",
      element: <LoginPage />,
    },
    {
      path: "/apply-to-seller",
      element: <ApplyToSeller />,
    },
    {
      path: "/HomeSeller",
      element: <HomeSeller />,
    },
    {
      path: "/createproducts",
      element: <CreateProducts />,
    },
    {
      path: "/MyProducts",
      element: <MyProducts />,
    },
    {
      path: "/Profile",
      element: <Profile />,
    },
    {
      path: "/Profile/ProfileEdit/:id",
      element: <ProfileEdit />,
    },
    {
      path: "/BuyProduct/:id",
      element: <Buyproduct />,
    },
    {
      path: "/MyOrder",
      element: <PurchaseList />,
    },
    {
      path: "/Card",
      element: <Order />,
    },
    {
      path: "/ChatBuyer",
      element: <ChatBuyer />,
    },
    {
      path: "/ChatSeller",
      element: <ChatSeller />,
    },
    {
      path: "/search/:title", // แก้ไขจาก tital เป็น title
      element: <SearchProducts />,
    },
    
    {
      path: "*",
      element: <HomeMember />,
    },
  ];
};

export default MemberRoutes;
