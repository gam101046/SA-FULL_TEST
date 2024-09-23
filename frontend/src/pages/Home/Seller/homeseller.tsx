
import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import brandner1 from "../../../assets/brandner.png";
import brandner2 from "../../../assets/Brandner2.png";
import brandner3 from "../../../assets/Brandner3.png";
import {Card } from "antd";
import icons1 from "../../../icon/book.png";
import icons2 from "../../../icon/pen.png";
import icons3 from "../../../icon/shoe.png";
import icons4 from "../../../icon/electronics.png";
import icons5 from "../../../icon/shirt.png";
import icons6 from "../../../icon/skirt.png";
import icons7 from "../../../icon/pants.png";
import "./homeseller.css"

import NavbarSeller from '../../../component/navbarSeller';
import { GetSellerByMemberId ,GetProducts} from '../../../services/http';
import { MemberInterface } from '../../../interfaces/Member';


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

const HomeSeller = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState<Products[]>([]);
  const navigate = useNavigate(); 
  //ส่วนที่เพิ่มสำหรับเซ็ตค่า Seller************************************************************************
  const [mid, setMid] = useState<number | null>(Number(localStorage.getItem("id")));
  const [member, setMember] = useState<MemberInterface | null>(null);

  const GetSellerByMemberID = async (member_id: number) => {
    let res = await GetSellerByMemberId(member_id); // Use the GetSellerByMember function
    if (res.status === 200) {
      setMember(res.data); // Set the fetched member data
    } else {
      messageApi.open({
        type: "error",
        content: res.data?.error || "Failed to fetch member information.",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await GetProducts(); // Fetch all products
      console.log('API result:', result); // ตรวจสอบผลลัพธ์ที่ได้จาก API
      if (Array.isArray(result)) {
        setProducts(result); // ตั้งค่าข้อมูลสินค้าเป็นอาร์เรย์ที่ได้รับ
      } else {
        console.error('Data format is incorrect:', result);
        messageApi.open({
          type: "error",
          content: "ข้อมูลที่ได้รับจาก API ไม่ถูกต้อง",
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
      });
    }
  };

  useEffect(() => {
    const storedId = Number(localStorage.getItem("id"));
    setMid(storedId); // Set mid from localStorage
    fetchProducts();

    if (storedId) {
      console.log(storedId); // Log the correct value for debugging
      GetSellerByMemberID(storedId); // Fetch seller by member ID
    }
  }, []);
  //ส่วนที่เพิ่ม************************************************************************
  const handleProductClick = (id: number) => {
    // เมื่อคลิกที่สินค้าให้ไปที่เส้นทาง /BuyProduct พร้อมส่ง id ไปด้วย
    navigate(`/BuyProduct/${id}`);
  };


  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((Index) =>
        Index === imageArray.length - 1 ? 0 : Index + 1
      ); 
    }, 3000);


    return () => {
      clearInterval(imageInterval);

    };
  }, []);

  return (
    <>      
      <div className='homeseller'>
        <NavbarSeller />
        <div className='box-pageseller'>
          <center>
            <img src={imageArray[currentImageIndex]} alt="brandner" />
          </center>
        </div>
        <div className="box-productseller">
          <img src={icons1} alt="icon1" /><img src={icons2} alt="icon2" /><img src={icons3} alt="icon3" />
          <img src={icons4} alt="icon4" /><img src={icons5} alt="icon5" /><img src={icons6} alt="icon6" /><img src={icons7} alt="icon7" />
        </div>

        <div className="Naw-arrivalsseller">
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
                style={{ width: 240, height: 350, margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                cover={
                  <img
                    alt={product.Title}
                    src={product.PictureProduct || 'https://via.placeholder.com/240'}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }} // ปรับขนาดรูปภาพ
                    onClick={() => handleProductClick(product.ID)}
                  />
                }
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
}

export default HomeSeller;


