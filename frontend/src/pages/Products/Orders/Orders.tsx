import "./Orders.css";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import {
  GetProductsByMemberId,
  GetOrdersByProductIDAndMemberID,
  DeleteOrder,
} from "../../../services/http/index";
import Logo from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/logo.png";
import Back from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/back-arrow.png";
import List from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/list.png";
import Notification from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/notifications-button.png";
import ShoppingCartIcon from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/shopping-cart.png";
import StarRating from "../../Review/star/starrating"; // นำเข้า StarRating component
import axios from 'axios';

interface Product {
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
  Quantity?: number;
}

interface Order {
  ID: number;
  Quantity: number;
  Total_price: number;
  SellerID: number;
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const MemberID = Number(localStorage.getItem("id"));
  const [Title, setSearchTitle] = useState<string>(""); 
  // Modal state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(5);

  // Function to fetch products with pagination
  const fetchProducts = async (page: number = 1, pageSize: number = 10) => {
    setProducts([]); // ตั้งค่า products ให้ว่างก่อนที่จะดึงข้อมูลใหม่
    try {
      const result = await GetProductsByMemberId(MemberID, page, pageSize);
      if (result && Array.isArray(result.products)) {
        const updatedProducts: Product[] = [];
        const uniqueProductOrderIds = new Set<number>();

        for (const product of result.products) {
          const orders: Order[] = await GetOrdersByProductIDAndMemberID(MemberID, product.ID);
          if (orders && orders.length > 0) {
            orders.forEach((order: Order) => {
              if (!uniqueProductOrderIds.has(order.ID)) {
                uniqueProductOrderIds.add(order.ID);
                updatedProducts.push({
                  ...product,
                  Price: order.Total_price,
                  OrderID: order.ID,
                  Quantity: order.Quantity,
                });
              }
            });
          } else if (!uniqueProductOrderIds.has(product.ID)) {
            uniqueProductOrderIds.add(product.ID);
            updatedProducts.push(product);
          }
        }
        setProducts(updatedProducts);
      }
    } catch (error) {
    }
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Title.trim()) {
      navigate(`/search/${Title}`); // นำทางไปยัง path ที่ต้องการ
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showModal = (product: Product) => {
    setModalText(`คุณต้องการลบข้อมูลคำสั่งซื้อสำหรับสินค้าชื่อ "${product.Title}" หรือไม่?`);
    setDeleteId(product.OrderID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await DeleteOrder(deleteId!);
      setOpen(false);
      setConfirmLoading(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลคำสั่งซื้อสำเร็จ",
      });
      fetchProducts();
    } catch (error) {
      setConfirmLoading(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบคำสั่งซื้อ",
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showReviewModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleReviewOk = async () => {
    if (selectedProduct) {
      await axios.post('http://localhost:8000/review', {
        Rating: rating,
        Comment: reviewText,
        ProductsID: selectedProduct.ID,
        MemberID, // ส่ง MemberID
      });
      setIsModalVisible(false);
      setReviewText('');
      setRating(5);
      messageApi.open({
        type: 'success',
        content: 'รีวิวเสร็จสิ้น',
      });
    }
  };

  const handleReviewCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "price",
      render: (price) => `฿${price}`,
    },
    {
      title: "Picture",
      dataIndex: "PictureProduct",
      key: "picture",
      render: (_, record) => (
        <img src={record.PictureProduct} alt={record.Title} width="170" />
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Review</div>,
      key: 'review',
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Button onClick={() => showReviewModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
          รีวิวสินค้า
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => showModal(record)}
          style={{ marginLeft: 10 }}
          shape="circle"
          icon={<DeleteOutlined />}
          size="large"
          danger
        />
      ),
    },
  ];

  const goToProductPage = () => {
    navigate("/HomeMember");
  };

  const goToReview = () => {
    navigate("/Review");
  };

  return (
    <div className="order">
      {contextHolder}
      <h1>รายการคำสั่งซื้อ</h1>
      <Table
        rowKey="ID"
        columns={columns}
        dataSource={products}
        className="columns"
        pagination={{
          pageSize: 2,
          onChange: (page, pageSize) => fetchProducts(page, pageSize),
        }}
      />
      <Modal
        title="ลบข้อมูลคำสั่งซื้อ?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>

      <Modal
        title={`รีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onOk={handleReviewOk}
        onCancel={handleReviewCancel}
        okText="ส่งรีวิว"
        cancelText="ยกเลิก"
      >
        <StarRating totalStars={5} onSelect={setRating} />
        <Input.TextArea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          placeholder="เขียนรีวิวของคุณที่นี่..."
        />
      </Modal>

      <div className="Buyproducts-search">
           <input
              type="text"
              placeholder="ค้นหา"
              value={Title}
              onChange={(e) => setSearchTitle(e.target.value)} // อัปเดตคำค้นหา
              onKeyPress={handleSearch} // เรียกใช้ฟังก์ชันเมื่อกด Enter
            />
      </div>
      <button className="button-login" onClick={goToReview} >รายการรีวิว</button>
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
    </div>
  );
};

export default Index;
