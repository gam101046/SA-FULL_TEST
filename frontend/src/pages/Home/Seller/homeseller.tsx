
// import { useState, useEffect, } from 'react';
// import { useNavigate } from 'react-router-dom';
// import brandner1 from "../../../assets/brandner.png";
// import brandner2 from "../../../assets/Brandner2.png";
// import brandner3 from "../../../assets/Brandner3.png";
// import {Card } from "antd";
// import icons1 from "../../../icon/book.png";
// import icons2 from "../../../icon/pen.png";
// import icons3 from "../../../icon/shoe.png";
// import icons4 from "../../../icon/electronics.png";
// import icons5 from "../../../icon/shirt.png";
// import icons6 from "../../../icon/skirt.png";
// import icons7 from "../../../icon/pants.png";
// import "./homeseller.css"

// import NavbarSeller from '../../../component/navbarSeller';
// import { GetSellerByMemberId ,GetProducts} from '../../../services/http';
// import { MemberInterface } from '../../../interfaces/Member';


// const { Meta } = Card;

// interface Products {
//   ID: number;
//   Title: string;
//   Price: number;
//   PictureProduct: string;
//   Description: string;
//   SellerID: number;
//   OrderID?: number;
// }


// const imageArray = [brandner1, brandner2, brandner3];

// const HomeSeller = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [products, setProducts] = useState<Products[]>([]);
//   const navigate = useNavigate(); 
//   //ส่วนที่เพิ่มสำหรับเซ็ตค่า Seller************************************************************************
//   const [mid, setMid] = useState<number | null>(Number(localStorage.getItem("id")));
//   const [member, setMember] = useState<MemberInterface | null>(null);

//   const GetSellerByMemberID = async (member_id: number) => {
//     let res = await GetSellerByMemberId(member_id); // Use the GetSellerByMember function
//     if (res.status === 200) {
//       setMember(res.data); // Set the fetched member data
//     } else {
//       messageApi.open({
//         type: "error",
//         content: res.data?.error || "Failed to fetch member information.",
//       });
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const result = await GetProducts(); // Fetch all products
//       console.log('API result:', result); // ตรวจสอบผลลัพธ์ที่ได้จาก API
//       if (Array.isArray(result)) {
//         setProducts(result); // ตั้งค่าข้อมูลสินค้าเป็นอาร์เรย์ที่ได้รับ
//       } else {
//         console.error('Data format is incorrect:', result);
//         messageApi.open({
//           type: "error",
//           content: "ข้อมูลที่ได้รับจาก API ไม่ถูกต้อง",
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       messageApi.open({
//         type: "error",
//         content: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
//       });
//     }
//   };

//   useEffect(() => {
//     const storedId = Number(localStorage.getItem("id"));
//     setMid(storedId); // Set mid from localStorage
//     fetchProducts();

//     if (storedId) {
//       console.log(storedId); // Log the correct value for debugging
//       GetSellerByMemberID(storedId); // Fetch seller by member ID
//     }
//   }, []);
//   //ส่วนที่เพิ่ม************************************************************************
//   const handleProductClick = (id: number) => {
//     // เมื่อคลิกที่สินค้าให้ไปที่เส้นทาง /BuyProduct พร้อมส่ง id ไปด้วย
//     navigate(`/BuyProduct/${id}`);
//   };


//   useEffect(() => {
//     const imageInterval = setInterval(() => {
//       setCurrentImageIndex((Index) =>
//         Index === imageArray.length - 1 ? 0 : Index + 1
//       ); 
//     }, 3000);


//     return () => {
//       clearInterval(imageInterval);

//     };
//   }, []);

//   return (
//     <>      
//       <div className='homeseller'>
//         <NavbarSeller />
//         <div className='box-pageseller'>
//           <center>
//             <img src={imageArray[currentImageIndex]} alt="brandner" />
//           </center>
//         </div>
//         <div className="box-productseller">
//           <img src={icons1} alt="icon1" /><img src={icons2} alt="icon2" /><img src={icons3} alt="icon3" />
//           <img src={icons4} alt="icon4" /><img src={icons5} alt="icon5" /><img src={icons6} alt="icon6" /><img src={icons7} alt="icon7" />
//         </div>

//         <div className="Naw-arrivalsseller">
//           <p>NEW ARRIVALS</p>
//         </div>
//         <div
//         className="products"
//         style={{ 
//           display: 'flex', 
//           flexWrap: 'wrap', 
//           gap: '20px' // กำหนดระยะห่างระหว่างการ์ดแต่ละใบ
//         }}
//       >
//         {products.length > 0 ? (
//             products.map(product => (
//               <Card
//                 key={product.ID}
//                 hoverable
//                 style={{ width: 240, height: 350, margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
//                 cover={
//                   <img
//                     alt={product.Title}
//                     src={product.PictureProduct || 'https://via.placeholder.com/240'}
//                     style={{ width: '100%', height: '220px', objectFit: 'cover' }} // ปรับขนาดรูปภาพ
//                     onClick={() => handleProductClick(product.ID)}
//                   />
//                 }
//               >
//                 <Meta title={product.Title} description={`ราคา: ${product.Price} บาท`} />
//               </Card>
//             ))
//           ) : (
//             <p>ไม่มีสินค้าที่แสดงผล</p>
//           )}
//       </div>
//       </div>
//     </>
//   );
// }

// export default HomeSeller;

import { useState, useEffect } from "react";
import banner1 from "../../../assets/brandner.png";
import banner2 from "../../../assets/Brandner2.png";
import banner3 from "../../../assets/Brandner3.png";
import { useNavigate } from 'react-router-dom';
import { Card } from "antd";
import categoryIcon1 from "../../../icon/book.png";
import categoryIcon2 from "../../../icon/pen.png";
import categoryIcon3 from "../../../icon/shoe.png";
import categoryIcon4 from "../../../icon/electronics.png";
import categoryIcon5 from "../../../icon/460230801_372939379221247_3630932967594282606_n.png";
import categoryIcon6 from "../../../icon/460524660_838646431715865_5765693732975643543_n.png";
import categoryIcon7 from "../../../icon/459515550_884766496934360_5182956364306110697_n.png";
import categoryIcon8 from "../../../icon/459515550_884766496934360_5182956364306110697_n.png"
import {  GetProducts } from '../../../services/http';

import "../home.css";
import Navbar from "../../../component/navbarSeller";
import { Col } from "antd";

const { Meta } = Card;

interface Products {
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
  CategoryID?: number;
}

const bannerImages = [banner1, banner2, banner3];

const HomePage = () => {

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Products[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const result = await GetProducts();
      if (Array.isArray(result)) {
        setProducts(result);
        setFilteredProducts(result);
      } else {
        messageApi.open({
          type: "error",
          content: "ข้อมูลที่ได้รับจาก API ไม่ถูกต้อง",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
      });
    }
  };

  const handleProductClick = (id: number) => {
        // เมื่อคลิกที่สินค้าให้ไปที่เส้นทาง /BuyProduct พร้อมส่ง id ไปด้วย
        navigate(`/BuyProduct/${id}`);
      };

  // ฟังก์ชันเพื่อเลือกหมวดหมู่สินค้า
const handleCategoryClick = (categoryId: number | null) => {
  setSelectedCategory(categoryId);

  if (categoryId === null) {
    // ถ้า categoryId เป็น null แสดงสินค้าทั้งหมด
    setFilteredProducts(products);
  } else {
    // กรองสินค้าตาม CategoryID ที่เลือก
    const filtered = products.filter(product => product.CategoryID === categoryId);
    setFilteredProducts(filtered);
  }
};
  

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      setActiveBannerIndex((index) =>
        index === bannerImages.length - 1 ? 0 : index + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (<>
    
    <div className="home-main-page">
      <Navbar/>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className="banner-section">
          <center>
            <img src={bannerImages[activeBannerIndex]} alt="banner" />
          </center>
        </div>
        <div className="category-section">
          <img src={categoryIcon1} alt="category1" className="category-icon" onClick={() => handleCategoryClick(1)} />
          <img src={categoryIcon2} alt="category2" className="category-icon" onClick={() => handleCategoryClick(2)} />
          <img src={categoryIcon3} alt="category3" className="category-icon" onClick={() => handleCategoryClick(3)} />
          <img src={categoryIcon4} alt="category4" className="category-icon" onClick={() => handleCategoryClick(4)} />
          <img src={categoryIcon5} alt="category5" className="category-icon" onClick={() => handleCategoryClick(5)} />
          <img src={categoryIcon6} alt="category6" className="category-icon" onClick={() => handleCategoryClick(6)} />
          <img src={categoryIcon7} alt="category7" className="category-icon" onClick={() => handleCategoryClick(7)} />
          <img src={categoryIcon8} alt="category8" className="category-icon" onClick={() => handleCategoryClick(null)} />
        </div>
        <div className="new-items-header">
          <p>NEW ITEMS</p>
        </div>
        <div
          className="products"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px' // กำหนดระยะห่างระหว่างการ์ดแต่ละใบ
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card
                key={product.ID}
                hoverable
                style={{ width: 240, margin: '10px' }} // หรือจะปรับ margin นี้
                cover={<img alt={product.Title} src={product.PictureProduct || 'https://via.placeholder.com/240'} />}
                onClick={() => handleProductClick(product.ID)}
              >
                <Meta title={product.Title} description={`ราคา: ${product.Price} บาท`} />
                
              </Card>
            ))
          ) : (
            <p>ไม่มีสินค้าที่แสดงผล</p>
          )}
        </div>

        </Col>
    </div>
  </>);
};

export default HomePage;


