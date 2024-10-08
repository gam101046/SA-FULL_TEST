import React, { useState } from 'react'; // เพิ่มการนำเข้า useState
import { useNavigate } from 'react-router-dom';
import bell from "../assets/bell.png";
import list from "../assets/list.png";
import Logo from "../assets/logo.png";
import market from "../assets/shopping-cart.png";
import "./navbarSeller.css";
import Chat from "../assets/chat.png";
import ShopRating from '../pages/Review/ReviewSeller/ShopRating';

const NavbarSeller = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [Title, setSearchTitle] = useState<string>("");
  const [isShopRatingVisible, setIsShopRatingVisible] = useState(false); 

  const handleCreateProduct = () => {
    navigate('/createproducts'); // Navigate to ApplyToSeller page
  };

  const handleShopRating = () => {
    setIsShopRatingVisible(true); // Open the modal
  };

  const closeShopRating = () => {
    setIsShopRatingVisible(false); // Close the modal
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Title.trim()) {
      navigate(`/search/${Title}`); // นำทางไปยัง path ที่ต้องการ
    }
  };
  const handleChatSeller = () => {
    navigate('/ChatSeller'); // Navigate to ApplyToSeller page
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
                  <input
                        type="text"
                        placeholder="ค้นหา"
                        value={Title}
                        onChange={(e) => setSearchTitle(e.target.value)} // อัปเดตคำค้นหา
                        onKeyPress={handleSearch} // เรียกใช้ฟังก์ชันเมื่อกด Enter
                      />
                  </div>
                  <button className="button-createproductseller" onClick={handleCreateProduct}>
                    เพิ่มสินค้า
                  </button>
                  <div className="box-navbarseller">
                    <img src={market} alt="market" onClick={handleShopRating}/>
                    <img src={list} alt="list"/>
                    <img src={bell} alt="bell"/>
                    <img src={Chat} alt="Chat" onClick={handleChatSeller}/>
                  </div>
                </div>
              </div>
              <ShopRating
        sellerID={1} // You can replace this with the actual seller ID
        visible={isShopRatingVisible}
        onClose={closeShopRating}
      />
              </div>
  );
}

export default NavbarSeller;


