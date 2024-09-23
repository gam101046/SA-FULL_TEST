import { Button, Card, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetProductsBySellerId, GetSellerByMemberId } from "../../../services/http/index";
import "./MyProducts.css";
import Logo from "../../../assets/logo.png";
import Back from "../../../assets/back-arrow.png";
import Chat from "../../../assets/chat.png";
import List from "../../../assets/list.png";
import Notification from "../../../assets/notifications-button.png";
import ShoppingCartIcon from "../../../assets/shopping-cart.png";
import { SellerInterface } from "../../../interfaces/Seller";

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
  const [messageApi, contextHolder] = message.useMessage();

  // Seller state
  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [sellerId, setSellerId] = useState<number | null>(null);
  const [products, setProducts] = useState<Products[]>([]);



  // Fetch products by seller ID
  const fetchProductsBySellerId = async (sellerId: number) => {
    const res = await GetProductsBySellerId(sellerId, 1, 10); // Assuming page 1 and 10 products per page
    if (res) {
      setProducts(res.products); // Set the products
    } else {
      messageApi.error("Error fetching products for seller");
    }
  };


  // Function to fetch seller by member_id
  const fetchSeller = async (member_id: number) => {
    const res = await GetSellerByMemberId(member_id); // Call the function
    if (!res.error) {
      setSeller(res.seller); // Set the seller object
      setSellerId(res.seller_id); // Set the seller ID
      fetchProductsBySellerId(res.seller_id); // Fetch products for this seller
    } else {
      message.error(res.error);
    }
    console.log("Form values:", res);
  };

  // Fetch the seller when the component mounts or the member_id changes
  useEffect(() => {
    const memberId = Number(localStorage.getItem("id")); // Assuming member_id is stored in localStorage
    if (memberId) {
      fetchSeller(memberId); // Fetch seller using the member ID
    }
  }, []);

  const goToProductPage = () => {
    navigate('/HomeSeller');
  };

  const handleToEditProduct = (id: number) => {
    // When clicking on a product, navigate to /EditProducts with the product ID
    navigate(`/EditProducts/${id}`);
  };

  const handleCreateProduct = () => {
    navigate('/createproducts'); // Navigate to ApplyToSeller page
  };

  return (
    <div className="myproducts">
      {contextHolder}
      <h1>My Products</h1>
      <Button className="button-review1">รีวิว</Button>
      <Button className="button-score2">คะแนนร้านค้า</Button>
      <Button className="button-product3"onClick={handleCreateProduct}>เพิ่มสินค้า</Button>
      <Button className='button-icon button-icon0'>
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
                    style={{ width: '100%', height: '210px', objectFit: 'cover' }} // ปรับขนาดรูปภาพ
                  />
                }
                onClick={() => handleToEditProduct(product.ID)} // Navigate to product edit page
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
