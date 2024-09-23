import { Button, Card, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetProductsByTitle,GetSellerByMemberId } from "../../../services/http/index"; 
import "./searchproducts.css";
import Logo from "../../../assets/logo.png";
import Back from "../../../assets/back-arrow.png";
import List from "../../../assets/list.png";
import Notification from "../../../assets/notifications-button.png";
import ShoppingCartIcon from "../../../assets/shopping-cart.png";

const { Meta } = Card;

interface Products {
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { title } = useParams<{ title: string }>(); 
  const [products, setProducts] = useState<Products[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>(title || ""); 
  const [messageApi, contextHolder] = message.useMessage();
  const MemberID = Number(localStorage.getItem("id"));

  // Function to fetch products by title
  const fetchProductsByTitle = async () => {
    try {
      const result = await GetProductsByTitle(searchTitle);
      console.log('API result:', result);
      if (Array.isArray(result)) {
        setProducts(result);
      } else {
        console.error('Data format is incorrect:', result);
        messageApi.open({
          type: "error",
          content: "ข้อมูลที่ได้รับจาก API ไม่ถูกต้อง",
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      navigate(`/search/${searchTitle}`); 
    }
  };

  const handleProductClick = (id: number) => {
    navigate(`/BuyProduct/${id}`);
  };

  const goToProductPage = () => {
    navigate('/');
  };

  useEffect(() => {
    if (title) {
      setSearchTitle(title);
      fetchProductsByTitle(); // เรียกค้นหาสินค้าเมื่อมี title
    }
  }, [title]);

  useEffect(() => {
    if (searchTitle) {
      fetchProductsByTitle(); // ค้นหาสินค้าทุกครั้งที่ searchTitle เปลี่ยนแปลง
    } else {
      setProducts([]); // หากไม่มีการค้นหา ให้ล้างผลลัพธ์สินค้า
    }
  }, [searchTitle]);

  const handleHome = async () => {
    if (MemberID === null) {
      messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
      return;
    }
  
    try {
      const sellerData = await GetSellerByMemberId(MemberID);
      if (sellerData && sellerData.error) {
        messageApi.open({
          type: "error",
          content: sellerData.error,
        });
        navigate('/HomeMember');
      } else if (sellerData) {
        navigate('/HomeSeller');
      } else {
        navigate('/HomeMember');
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ขาย",
      });
    }
  };

  return (
    <div className="myproducts">
      {contextHolder}
      <h1>รายการค้นหา</h1>
      <img src={Logo} className="logo" alt="Course Logo" />
      <div className="Buyproducts-search">
        <Input
          type="text"
          placeholder="ค้นหาสินค้า"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)} 
          onKeyPress={handleKeyPress} 
        />
      </div>
      <button className="button-login">สร้างการขาย</button>
      <img src={Logo} className="logo" alt="Course Logo" />
      <div className="right-section">
        <div className="links">
          <Button className="button-icon button-icon1">
            <img src={ShoppingCartIcon} alt="Shopping Cart" />
          </Button>
          <Button className="button-icon button-icon2">
            <img src={List} alt="List" />
          </Button>
          <Button className="button-icon button-icon3">
            <img src={Notification} alt="Notification" />
          </Button>
          <Button className="button-icon button-icon4" onClick={handleHome}>
            <img src={Back} alt="Back" />
          </Button>
        </div>
      </div>
      <div className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <Card
              key={product.ID}
              hoverable
              style={{ width: 240, height: 350, margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              cover={
                <img
                  alt={product.Title}
                  src={product.PictureProduct || 'https://via.placeholder.com/240'}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  onClick={() => handleProductClick(product.ID)} 
                />
              }
            >
              <Meta title={product.Title} description={`ราคา: ${product.Price} บาท`} />
            </Card>
          ))
        ) : (
          <p>ไม่มีสินค้าที่แสดงผล</p>
        )}
      </div>
    </div>
  );
};

export default Index;
