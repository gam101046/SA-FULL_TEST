// import NavbarMyProducts from '../../../component/navbarproducts';
// import "./MyProducts.css";
// import { Card, Col, Row } from 'antd';
// import market from "../../../assets/market.png";




// interface Products {
//   ID: number;
//   Title: string;
//   Price: number;
//   Picture_product: string;
//   Description: string;
//   SellerID: number;
// }

// const Products = () => {

//   const { Meta } = Card;
//   return (
//     <>
//       <div className='homemyproduct'>
//         <NavbarMyProducts />
//           <div className='headmyproducts'>
//             <img src={market} alt="market" style={{width:"30px", height:"30px"}}/>
//             <h2>MyProduct</h2>
//           </div>
//         <Row gutter={[16, 16]}>
//           <Col span={5} >
//             <Card
//               hoverable
//               style={{ 
//                 width: 150,
//                 height: 100,
//                 marginTop: 15,
//                 marginLeft:80
//               }}

//               cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
//             >
//               <Meta title="Europe Street beat" description="www.instagram.com" />
//             </Card>
//           </Col>
//           <Col span={6} />
//           <Col span={6} />
//           <Col span={6} />
          
//           <Col span={6} />
//           <Col span={6} />
//           <Col span={6} />
//           <Col span={6} />
//         </Row>


//       </div>

//     </>
//   );
// }

// export default Products;





import { Button, Card, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetProducts } from "../../../services/http/index";
import "./MyProducts.css";
import Logo from "../../../assets/logo.png";
import Back from "../../../assets/back-arrow.png";
import Chat from "../../../assets/chat.png";
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
  const [products, setProducts] = useState<Products[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const result = await GetProducts(); // Fetch all products
      console.log('API result:', result); // ตรวจสอบผลลัพธ์ที่ได้จาก API
      if (Array.isArray(result)) {
        setProducts(result); // ตั้งค่าข้อมูลสินค้าเป็นอาร์เรย์ที่ได้รับ
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
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const goToProductPage = () => {
    navigate('/');
  };

  return (
    <div className="myproducts">
      {contextHolder}
      <h1>My Products</h1>
      <Button className="button-review">รีวิว</Button>
      <Button className="button-score">คะแนนร้านค้า</Button>
      <Button className="button-product">เพิ่มสินค้า</Button>
      <Button className='button-icon button-icon5'>
        <img src={Chat} alt='Chat' />
      </Button>
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
          <Button className="button-icon button-icon4" onClick={goToProductPage}>
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
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }} // ปรับขนาดรูปภาพ
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
