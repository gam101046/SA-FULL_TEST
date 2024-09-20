import { ArrowCircleLeft, ArrowCircleRight, Minus, Plus } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // เพิ่ม useParams
import { CreateOrder, CreateProductsOrder, GetProductsById } from '../../../services/http/index';
import "./BuyProducts.css";
import Logo from "/Users/gam/sa-67-song_thor_sut/frontend/public/4-Photoroom.png";
import Back from "/Users/gam/sa-67-song_thor_sut/frontend/public/back.png";
import List from "/Users/gam/sa-67-song_thor_sut/frontend/public/list.png";
import Notification from "/Users/gam/sa-67-song_thor_sut/frontend/public/notifications-button.png";
import ShoppingCartIcon from "/Users/gam/sa-67-song_thor_sut/frontend/public/shopping-cart.png";

interface Products {
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
}

const Byproduct: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Products | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState<number | null>(null);
  const MemberID = Number(localStorage.getItem("id"));

  const { id } = useParams<{ id: string }>(); // ใช้ useParams เพื่อรับ productId จาก path
  const productId = Number(id); // แปลงค่า id เป็นตัวเลข

  useEffect(() => {
    const fetchProduct = async () => {
      const data: Products = await GetProductsById(productId);
      if (data) {
        setProduct(data);
      }
    };
    fetchProduct();
    setMemberId(MemberID); // สมมติว่า MemberID ถูกตั้งเป็น 7
  }, [productId]);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const goToIndexPage = () => {
    navigate('/HomeMember');
  };

  const goToIndexPageOrder = () => {
    navigate('/MyOrder');
  };

  const handleBuyProduct = () => {
    setIsModalVisible(true); // Show custom Modal for confirmation
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the custom Modal without ordering
  };

  const confirmOrder = async () => {
    if (product && memberId !== null) {
      const totalPrice = product.Price * quantity;
  
      const orderData = {
        MemberID: memberId,
        SellerID: product.SellerID,
        Quantity: quantity,
        Total_price: totalPrice,
      };
  
      // สร้างคำสั่งซื้อ
      const result = await CreateOrder(orderData);

      if (result) {
        const OrderID = result.data.ID; // สมมติว่าผลลัพธ์มี ID ของคำสั่งซื้อที่สร้างขึ้น

        // สร้าง Products_Order
        const productsOrderData = {
          OrderID: OrderID,
          ProductID: productId,
        };
  
        CreateProductsOrder(productsOrderData);
      }
    }
    setIsModalVisible(false); // ปิด Modal หลังจากสร้างคำสั่งซื้อเสร็จสิ้น
  };
  

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className='Buyproducts'>
      {/* Custom Modal */}
      {isModalVisible && (
        <div className="custom-modal">
          <div className="modal-content">
            <p>ต้องการซื้อสินค้าใช่หรือไม่</p>
            <div className="modal-actions">
              <button onClick={handleCloseModal} className="cancel-button" >ยกเลิก</button>
              <button onClick={confirmOrder} className="confirm-button">ยืนยัน</button>
            </div>
          </div>
        </div>
      )}

      <h1>{product.Title}</h1>
      <h2>฿{product.Price}</h2>
      <h3>จำนวน</h3>

      <img src={Logo} className='logo' alt='Course Logo' />

      <div className='right-section'>
        <div className='links'>
          <div className="Buyproducts-search">
            <input type="text" placeholder="search" />
          </div>
          <button className="button-login">สร้างการขาย</button>

          <button className='button-icon button-icon1'  onClick={goToIndexPageOrder}>
            <img src={ShoppingCartIcon} alt='Shopping Cart' />
          </button>

          <div className='button-icon button-icon2 '>
            <img src={List} alt='List' />
          </div>

          <button className='button-icon button-icon3'>
            <img src={Notification} alt='Notification' />
          </button>

          <button className='button-icon button-icon4' onClick={goToIndexPage}>
            <img src={Back} alt='Back' />
          </button>

          <div className="frame-1">
            <img src={product.PictureProduct} className="Bag" alt='Product' />
          </div>

          <Plus size={25} className="icon-plus" onClick={increaseQuantity} />
          <Minus size={25} className="icon-minus" onClick={decreaseQuantity} />

          <div className="quantity-control">
            <span className="quantity">{quantity}</span>
          </div>

          <button className="Buy-products" onClick={handleBuyProduct}>ซื้อสินค้า</button>
          <button className="Chat">แชทกับผู้ขาย</button>

          <div className="rectangle">
            <h1>{product.Description}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Byproduct;
