import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'; // เพิ่มการนำเข้า useState
import "./navbarMember.css";
import Logo from "../assets/logo.png";
import list from "../assets/list.png";
import market from "../assets/shopping-cart.png";
import bell from "../assets/bell.png";

const NavbarMember = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [Title, setSearchTitle] = useState<string>(""); // State สำหรับคำค้นหา

  const handleApplySeller = () => {
    navigate('/apply-to-seller'); // Navigate to ApplyToSeller page
  };

  // ฟังก์ชันสำหรับจัดการการค้นหา
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Title.trim()) {
      navigate(`/search/${Title}`); // นำทางไปยัง path ที่ต้องการ
    }
  };

  return (
    <div className='navbarmember'>
      <img
        src={Logo}
        alt="Course Logo"
        style={{
          width: "200px",
          marginRight: "20px",
          marginTop: "0px"
        }}
      />
      <div className='right-sectionmember'>
        <div className='linksmember'>
          <div className="search">
            <input
              type="text"
              placeholder="ค้นหา"
              value={Title}
              onChange={(e) => setSearchTitle(e.target.value)} // อัปเดตคำค้นหา
              onKeyPress={handleSearch} // เรียกใช้ฟังก์ชันเมื่อกด Enter
            />
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
