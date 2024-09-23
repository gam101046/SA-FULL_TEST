import {  Minus, Plus } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // เพิ่ม useParams
import { CreateOrder, CreateProductsOrder, GetProductsById ,CreateRoomChat,GetSellerByMemberId} from '../../../services/http/index';
import "./BuyProducts.css";
import Logo from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/logo.png";
import Back from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/back-arrow.png";
import List from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/list.png";
import Notification from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/notifications-button.png";
import ShoppingCartIcon from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/shopping-cart.png";
import { message} from "antd";

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
  const [Title, setSearchTitle] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

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

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Title.trim()) {
      navigate(`/search/${Title}`); // นำทางไปยัง path ที่ต้องการ
    }
  };

  const goToIndexPage = () => {
    navigate('/HomeMember');
  };

  const goToIndexPageOrder = () => {
    navigate('/Card');
  };

  const handleBuyProduct = () => {
    setIsModalVisible(true); // Show custom Modal for confirmation
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the custom Modal without ordering
  };

  const handleChatWithSeller = async () => {
    if (memberId !== null && product) {
      // เช็คว่ามี memberId และ product หรือไม่
      // ถ้ามี จะทำการสร้างห้องแชทโดยส่ง MemberID และ SellerID
      const result = await CreateRoomChat(MemberID, product.SellerID);
      
      // ตรวจสอบผลลัพธ์จากการสร้างห้องแชท
      if (result) {
        if (result.message === "Room already exists") {
          // ถ้าห้องแชทมีอยู่แล้ว นำทางไปยังหน้า ChatBuyer
          navigate('/ChatBuyer');
        } else {
          // ถ้าสร้างห้องแชทสำเร็จ จะนำทางไปยังหน้า ChatBuyer
          navigate('/ChatBuyer');
        }
      } else {
        // ถ้ามีข้อผิดพลาด จะตั้งค่าข้อความข้อผิดพลาด
        setErrorMessage(result.message || "เกิดข้อผิดพลาดในการสร้างห้องแชท");
      }
    }
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
          <input
              type="text"
              placeholder="ค้นหา"
              value={Title}
              onChange={(e) => setSearchTitle(e.target.value)} // อัปเดตคำค้นหา
              onKeyPress={handleSearch} // เรียกใช้ฟังก์ชันเมื่อกด Enter
            />
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

          <button className='button-icon button-icon4' onClick={handleHome}>
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
          <button className="Chat" onClick={handleChatWithSeller}>แชทกับผู้ขาย</button>

          <div className="rectangle">
            <h1>{product.Description}</h1>
          </div>
        </div>
      </div>
     </div>
    
  );
};

export default Byproduct;
function setErrorMessage(arg0: any) {
  throw new Error("Function not implemented.");
}

