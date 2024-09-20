import { useNavigate } from 'react-router-dom';
import "./navbar.css";
import Logo from "../assets/logo.png";
import Chat from "../assets/chat.png";
import list from "../assets/list.png";
import market from "../assets/shopping-cart.png";
import bell from "../assets/bell.png";
import backarrow from "../assets/back-arrow.png";

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleHomeSeller = () => {
    navigate('/HomeSeller'); 
  };

  const handleCreateProduct = () => {
    navigate('/createproducts'); 
  };

  return (
    <div className='navbar'>
            <img
              src={Logo}
              alt="Course Logo"
              style={{
                width: "200px",
                marginRight: "30px",
                marginTop:"0"
              }}
            />
     <div className='right-section'>
       <div className='links'>
       <button className="button-createproduct" >
           รีวิว
         </button>
         <button className="button-createproduct" >
           คะแนนร้านค้า
         </button>
         <button className="button-createproduct" onClick={handleCreateProduct}>
           เพิ่มสินค้า
         </button>

        <div className='imgbox'>
            <img src={Chat} alt="Chat"/>
            <img src={market} alt="market"/>
            <img src={list} alt="list"/>
            <img src={bell} alt="bell"/>
            <img src={backarrow} alt="back" onClick={handleHomeSeller}/>
        </div>

       </div>
     </div>
    </div>
  );
}

export default Navbar;


