import { useState, useEffect } from "react";
import { PRODUCTS } from "../../Product";

import banner1 from "../../assets/brandner.png";
import banner2 from "../../assets/Brandner2.png";
import banner3 from "../../assets/Brandner3.png";

import categoryIcon1 from "../../icon/book.png";
import categoryIcon2 from "../../icon/pen.png";
import categoryIcon3 from "../../icon/shoe.png";
import categoryIcon4 from "../../icon/electronics.png";
import categoryIcon5 from "../../icon/shirt.png";
import categoryIcon6 from "../../icon/skirt.png";
import categoryIcon7 from "../../icon/pants.png";


import "./home.css";
import Navbar from "../../component/navbar";
import { Col } from "antd";
import { ItemCard } from "./products";


const bannerImages = [banner1, banner2, banner3];

const HomePage = () => {

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);


  useEffect(() => {
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

        <div className="item-list">
          {PRODUCTS.map((product) => (
            <ItemCard key={product.id} data={product} />
          ))}
        </div>
        </Col>
    </div>
  </>);
};

export default HomePage;
