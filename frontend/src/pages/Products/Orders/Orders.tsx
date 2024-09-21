import "./Orders.css";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { GetProductsByMemberId, GetOrdersByProductIDAndMemberID, DeleteOrder } from "../../../services/http/index";
import Logo from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/logo.png";
import Back from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/back-arrow.png";
import List from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/list.png";
import Notification from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/notifications-button.png";
import ShoppingCartIcon from "/Users/gam/Desktop/SA-FULL/Project-SA-G15-FULL-main/frontend/src/assets/shopping-cart.png";


interface Product {
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
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
  
  // Modal state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number | undefined>();

  // Function to fetch products with pagination
  const fetchProducts = async (page: number = 1, pageSize: number = 10) => { // Replace with the actual seller ID
    try {
      const result = await GetProductsByMemberId(MemberID, page, pageSize);
      if (result && Array.isArray(result.products)) {
        const updatedProducts: Product[] = []; // Initialize an empty array
        const uniqueProductOrderIds = new Set<number>(); // Set to keep track of unique product-order combinations
  
        for (const product of result.products) {
          const orders: Order[] = await GetOrdersByProductIDAndMemberID(MemberID, product.ID);
          if (orders && orders.length > 0) {
            // แยกรายการสินค้าตาม Order ที่ต่างกัน
            orders.forEach((order: Order) => {
              const uniqueKey = `${product.ID}-${order.ID}`; // Unique key for product-order combination
              if (!uniqueProductOrderIds.has(order.ID)) {
                uniqueProductOrderIds.add(order.ID); // Mark this order ID as added
                updatedProducts.push({
                  ...product,
                  Price: order.Total_price,
                  OrderID: order.ID,
                  Quantity: order.Quantity,
                });
              }
            });
          } else {
            // หากไม่มีคำสั่งซื้อ ให้แสดงรายการสินค้าเดิม
            if (!uniqueProductOrderIds.has(product.ID)) {
              uniqueProductOrderIds.add(product.ID); 
              updatedProducts.push(product);
            }
          }
        }
  
        setProducts(updatedProducts); 
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  useEffect(() => {
    fetchProducts();
  }, []);

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
      dataIndex: "Picture_product",
      key: "picture",
      render: (_, record) => (
        <img src={record.PictureProduct} alt={record.Title} width="170" />
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

  const goToProductPage = () => {
    navigate('/');
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
      <div className="Buyproducts-search">
        <input type="text" placeholder="search" />
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
          <Button className="button-icon button-icon4" onClick={goToProductPage}>
            <img src={Back} alt="Back" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
