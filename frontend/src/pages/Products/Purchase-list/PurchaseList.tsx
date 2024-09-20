import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOrder, GetOrdersByProductIDAndSellerID, GetProductsBySellerId ,GetMemberById} from "../../../services/http/index";
import "./Index.css";
import Logo from "/Users/gam/sa-67-song_thor_sut/frontend/public/4-Photoroom.png";
import Back from "/Users/gam/sa-67-song_thor_sut/frontend/public/back.png";
import Chat from "/Users/gam/sa-67-song_thor_sut/frontend/public/chat.png";
import List from "/Users/gam/sa-67-song_thor_sut/frontend/public/list.png";
import Notification from "/Users/gam/sa-67-song_thor_sut/frontend/public/notifications-button.png";
import ShoppingCartIcon from "/Users/gam/sa-67-song_thor_sut/frontend/public/shopping-cart.png";

interface Product {
  ID: number;
  Title: string;
  Price: number;
  Picture_product: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
}


interface Order {
  ID: number;
  Quantity: number;
  Total_price: number;
  SellerID: number;
  MemberID: number;
}

interface Member {
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
}


const Index: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const MemberID = Number(localStorage.getItem("id"));
  
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number | undefined>();


  const fetchProducts = async (page: number = 1, pageSize: number = 10) => {
    const sellerId = 2;
    try {
      const result = await GetProductsBySellerId(sellerId, page, pageSize);
      if (result && Array.isArray(result.products)) {
        const updatedProducts: Product[] = [];
        const uniqueProductOrderIds = new Set<number>(); // Set to keep track of unique product-order combinations
  
        for (const product of result.products) {
          const orders: Order[] = await GetOrdersByProductIDAndSellerID(sellerId, product.ID);
          if (orders && orders.length > 0) {
            for (const order of orders) {
              const uniqueKey = `${product.ID}-${order.ID}`;
              if (!uniqueProductOrderIds.has(order.ID)) {
                uniqueProductOrderIds.add(order.ID); // Mark this order ID as added
  
 
                const memberData: Member | undefined = await GetMemberById(order.MemberID);
                updatedProducts.push({
                  ...product,
                  Price: order.Total_price,
                  OrderID: order.ID,
                  Quantity: order.Quantity,
                  MemberID: order.MemberID,
                  FirstName: memberData?.FirstName,
                  LastName: memberData?.LastName,
                  PhoneNumber: memberData?.PhoneNumber,
                });
              }
            }
          } else {
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
      title: "Quantity",
      dataIndex: "Quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "price",
      render: (price) => `฿${price}`,
    },
    {
      title: "Name",
      key: "memberName",
      render: (_, record) => `${record.FirstName || ""} ${record.LastName || ""}`, // รวม FirstName และ LastName
    },
    {
      title: "PhoneNumber",
      dataIndex: "PhoneNumber", // เพิ่มเบอร์โทรสมาชิก
      key: "PhoneNumber",
    },
    {
      title: "Picture",
      dataIndex: "Picture_product",
      key: "picture",
      render: (_, record) => (
        <img src={record.Picture_product} alt={record.Title} width="170" />
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
    <div className="index">
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
    </div>
  );
};

export default Index;
