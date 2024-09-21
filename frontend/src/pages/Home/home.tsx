import { useState, useEffect } from "react";
import { PRODUCTS } from "../../Product";

import banner1 from "../../assets/brandner.png";
import banner2 from "../../assets/Brandner2.png";
import banner3 from "../../assets/Brandner3.png";
import { Card } from "antd";
import categoryIcon1 from "../../icon/book.png";
import categoryIcon2 from "../../icon/pen.png";
import categoryIcon3 from "../../icon/shoe.png";
import categoryIcon4 from "../../icon/electronics.png";
import categoryIcon5 from "../../icon/shirt.png";
import categoryIcon6 from "../../icon/skirt.png";
import categoryIcon7 from "../../icon/pants.png";
import {  GetProducts } from '../../services/http';


import "./home.css";
import Navbar from "../../component/navbar";
import { Col } from "antd";
import { ItemCard } from "./products";


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

const bannerImages = [banner1, banner2, banner3];

const HomePage = () => {

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Products[]>([]);

  const fetchProducts = async () => {
    try {
      const result = await GetProducts();
      if (Array.isArray(result)) {
        setProducts(result);
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
          <img src={categoryIcon1} alt="category1" />
          <img src={categoryIcon2} alt="category2" />
          <img src={categoryIcon3} alt="category3" />
          <img src={categoryIcon4} alt="category4" />
          <img src={categoryIcon5} alt="category5" />
          <img src={categoryIcon6} alt="category6" />
          <img src={categoryIcon7} alt="category7" />
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
          {products.length > 0 ? (
            products.map(product => (
              <Card
                key={product.ID}
                hoverable
                style={{ width: 240, margin: '10px' }} // หรือจะปรับ margin นี้
                cover={<img alt={product.Title} src={product.PictureProduct || 'https://via.placeholder.com/240'} />}
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
