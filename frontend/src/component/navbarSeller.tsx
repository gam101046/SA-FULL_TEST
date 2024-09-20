import { useNavigate } from 'react-router-dom';
import "./navbarSeller.css";
import Logo from "../assets/logo.png";
import list from "../assets/list.png";
import market from "../assets/shopping-cart.png";
import bell from "../assets/bell.png";

const NavbarSeller = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleCreateProduct = () => {
    navigate('/createproducts'); // Navigate to ApplyToSeller page
  };

  return (
    <div className='navbarseller'>
            <img
              src={Logo}
              alt="Course Logo"
              style={{
                width: "200px",
                marginRight: "20px",
                marginTop:"0px"
              }}
            />
     <div className='right-sectionseller'>
       <div className='linksseller'>
         <div className="search">
           <input type="text" placeholder="search"/>
         </div>
         <button className="button-createproductseller" onClick={handleCreateProduct}>
           เพิ่มสินค้า
         </button>
         <div className="box-navbarseller">
           <img src={market} alt="market"/>
           <img src={list} alt="list"/>
           <img src={bell} alt="bell"/>
         </div>
       </div>
     </div>
    </div>
  );
}

export default NavbarSeller;


