import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // เปลี่ยนจาก useHistory เป็น useNavigate

import brandner1 from "../../../assets/brandner.png";
import brandner2 from "../../../assets/Brandner2.png";
import brandner3 from "../../../assets/Brandner3.png";

import icons1 from "../../../icon/book.png";
import icons2 from "../../../icon/pen.png";
import icons3 from "../../../icon/shoe.png";
import icons4 from "../../../icon/electronics.png";
import icons5 from "../../../icon/shirt.png";
import icons6 from "../../../icon/skirt.png";
import icons7 from "../../../icon/pants.png";
import "./homemember.css"
import { Card } from "antd";
import NavbarMember from '../../../component/navbarMember';
import { MemberInterface } from '../../../interfaces/Member';
import { GetMemberById, GetProducts } from '../../../services/http';

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

const imageArray = [brandner1, brandner2, brandner3];

const HomeMember = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState<Products[]>([]);
  const [mid, setMid] = useState<number | null>(Number(localStorage.getItem("id")));
  const [member, setMember] = useState<MemberInterface | null>(null);

  const navigate = useNavigate(); // ใช้ useNavigate แทน useHistory

  const GetMemberId = async (member_id: number) => {
    let res = await GetMemberById(member_id);
    if (res.status == 200) {
      setMember(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

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

  const handleProductClick = (id: number) => {
    // เมื่อคลิกที่สินค้าให้ไปที่เส้นทาง /BuyProduct พร้อมส่ง id ไปด้วย
    navigate(`/BuyProduct/${id}`);
  };

  useEffect(() => {
    setMid(Number(localStorage.getItem("id")));
    GetMemberId(mid!);
    fetchProducts();
  }, [mid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((Index) =>
        Index === imageArray.length - 1 ? 0 : Index + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='homemember'>
        <NavbarMember />
        <div className='box-pagemember'>
          <center>
            <img src={imageArray[currentImageIndex]} alt="brandner" />
          </center>
        </div>
        <div className="box-productmember">
          <img src={icons1} alt="icon1" /><img src={icons2} alt="icon2" /><img src={icons3} alt="icon3" />
          <img src={icons4} alt="icon4" /><img src={icons5} alt="icon5" /><img src={icons6} alt="icon6" /><img src={icons7} alt="icon7" />
        </div>

        <div className="Naw-arrivalsmember">
          <p>NEW ARRIVALS</p>
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
                onClick={() => handleProductClick(product.ID)} // เมื่อคลิกให้เรียกฟังก์ชันนี้
              >
                <Meta title={product.Title} description={`ราคา: ${product.Price} บาท`} />
              </Card>
            ))
          ) : (
            <p>ไม่มีสินค้าที่แสดงผล</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeMember;
