import { Alert, Button, Modal, Rate, Spin, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbarproducts from '../../../component/NavbarSellerReview';
import { MemberInterface } from '../../../interfaces/Member'; // import interface สำหรับ Member
import { ProductsInterface } from '../../../interfaces/Products';
import { Review } from '../../../interfaces/review';
import './ReviewSeller.css'; // นำเข้า CSS

const ReviewSell: React.FC = () => {
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsInterface | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [members, setMembers] = useState<MemberInterface[]>([]); // state สำหรับเก็บข้อมูลสมาชิก

  const sellerID = 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductsInterface[]>(`http://localhost:8000/products/seller/${sellerID}`);
        setProducts((response.data as any).products || response.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>('http://localhost:8000/review');
        setReviews(response.data);
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว:', err);
      }
    };

    const fetchMembers = async () => { // ฟังก์ชันสำหรับดึงข้อมูลสมาชิก
      try {
        const response = await axios.get<MemberInterface[]>('http://localhost:8000/member');
        setMembers(response.data);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
    fetchMembers(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลสมาชิก
  }, [sellerID]);

  const showModal = (product: ProductsInterface) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  if (loading) return <Spin tip="Loading products..." />;
  if (error) return <Alert message={error} type="error" />;

  const productsWithReviews = products.filter((product) =>
    reviews.some((review) => review.ProductsID === product.ID)
  );

  return (
    <div>
      <Navbarproducts />
      <Table
        dataSource={productsWithReviews}
        columns={[
          {
            title: <div style={{ textAlign: 'center' }}>Picture</div>,
            dataIndex: 'PictureProduct',
            key: 'PictureProduct',
            align: 'center',
            width: 200,
            render: (text: string) => (
              <img
                src={text}
                alt="product"
                style={{ width: 100, height: 100, objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                }}
              />
            ),
            className: 'column-picture',
          },
          {
            title: <div style={{ textAlign: 'center' }}>Title</div>,
            dataIndex: 'Description',
            key: 'Description',
            width: 800,
            className: 'column-title',
          },
          {
            title: <div style={{ textAlign: 'center' }}>Price</div>,
            dataIndex: 'Price',
            key: 'Price',
            render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
            align: 'center',
            width: 200,
            className: 'column-price',
          },
          {
            title: <div style={{ textAlign: 'center' }}>Review</div>,
            key: 'review',
            align: 'center',
            width: 200,
            render: (_, record) => (
              <Button onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
                ดูรีวิว
                
              </Button>
              
            ),
            className: 'column-review',
          },
        ]}
        rowKey="ID"
        pagination={false}
      />

      <Modal
        title={`คุณกำลังดูรีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="custom-modal"
      >
        
        {reviews.length > 0 ? (
          reviews
            .filter((review) => review.ProductsID === selectedProduct?.ID)
            .map((review, index) => {
              const member = members.find(member => member.ID === review.MemberID);
              return (
                <div key={index} style={{ marginBottom: '16px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#f4f0ec' }}>
                  <p style={{ margin: '0' }}>คะแนน: <Rate allowHalf disabled value={review.Rating || 0} /></p>
                  <p>ความคิดเห็น: {review.Comment}</p>
                  {member && <p>โดย: {member.Username}</p>}
                </div>
              );
            })
        ) : (
          <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
        )}
      </Modal>
    </div>
  );
};

export default ReviewSell;