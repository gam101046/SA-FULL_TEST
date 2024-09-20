import { useNavigate } from 'react-router-dom';
import "./navbarMember.css";
import Logo from "../assets/logo.png";
import list from "../assets/list.png";
import market from "../assets/shopping-cart.png";
import bell from "../assets/bell.png";

const NavbarMember = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleApplySeller = () => {
    navigate('/apply-to-seller'); // Navigate to ApplyToSeller page
  };

  return (
    <div className='navbarmember'>
            <img
              src={Logo}
              alt="Course Logo"
              style={{
                width: "200px",
                marginRight: "20px",
                marginTop:"0px"
              }}
            />
     <div className='right-sectionmember'>
       <div className='linksmember'>
         <div className="search">
           <input type="text" placeholder="search"/>
         </div>
         <button className="button-createproductmember" onClick={handleApplySeller}>
           สร้างการขายสินค้า
         </button>
         <div className="box-navbarmember">
           <img src={market} alt="market"/>
           <img src={list} alt="list"/>
           <img src={bell} alt="bell"/>
         </div>
       </div>
     </div>
    </div>
  );
}

export default NavbarMember;


