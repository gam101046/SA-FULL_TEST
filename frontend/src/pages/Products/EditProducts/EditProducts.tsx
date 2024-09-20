import './EditProducts.css';
import backarrow from "../../../assets/back-arrow.png";
import Logo from "../../../assets/logo.png";
import { Card, Col, Row, Input, Form, InputNumber, Select, Upload, Image, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { GetCategory, GetCondition } from '../../../services/http';
import { CategoryInterface } from '../../../interfaces/Category';
import { ConditionInterface } from '../../../interfaces/Condition';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const { Option } = Select;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CreateProducts: React.FC = () => {
  const navigate = useNavigate(); 
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [category, setcategory] = useState<CategoryInterface[]>([]);
  const [condition, setcondition] = useState<ConditionInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


 //Sellect Products
  const getcategory = async () => {
    let res = await GetCategory();
    if (res) {
      setcategory(res);
    }
  };

  useEffect(() => {
    getcategory();
  }, []);

  const getcondition = async () => {
    let res = await GetCondition();
    if (res) {
      setcondition(res);
    }
  };
  useEffect(() => {
    getcondition();
  }, []);

  const handleBacktoHome = () => {
    navigate('/SellerHome'); 
  };



  return (
    <>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card
        style={{
          borderRadius: "12px",
          padding: "24px",
          background: "#e2dfdf",
          width: "1100px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
                marginTop: "-80px",
              }}
            >
              <img
                src={Logo}
                alt="Course Logo"
                style={{
                  width: "200px",
                  marginRight: "20px",
                  marginTop: "0",
                }}
              />
              <h2 style={{ margin: "0 180px" }}>แก้ไขสินค้า</h2>
              <img
                src={backarrow}
                alt="backarrow"
                onClick={handleBacktoHome}
                style={{
                  width: "40px",
                  cursor: "pointer",
                  marginLeft: "130px",
                }}
              />
            </div>
          </Col>
        </Row>
  
        <Row gutter={[16, 16]} justify="center" 
          style={{ 
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-40px", 
            height: "425px" }}>
          <Col span={12}>
            <Form>
              <Form.Item
                label="ชื่อสินค้า"
                name="title"
                rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input placeholder="ชื่อสินค้า" size="large" style={{ width: "100%" }} />
              </Form.Item>
  
              <Form.Item
                label="รายละเอียดของสินค้า"
                name="Description"
                style={{ marginBottom: "16px" }}
              >
                <Input.TextArea
                  placeholder="คำอธิบาย"
                  size="large"
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  style={{ width: "100%" }}
                />
              </Form.Item>
  
              <Form.Item
                label="ราคาสินค้า"
                name="price"
                rules={[{ required: true, message: "กรุณากรอกราคาสินค้า!" }]}
                style={{ marginBottom: "16px" }}
              >
                <InputNumber placeholder="ราคาสินค้า" size="large" style={{ width: "100%" }} />
              </Form.Item>
  
              <Form.Item
                label="หมวดหมู่สินค้า"
                name="category"
                rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่สินค้า!" }]}
                style={{ marginBottom: "16px" }}
              >
                  <Select size="large" style={{ width: "100%" }} >
                  {category.map((item) => (
                        <Option value={item.ID} key={item.NameCategory}>
                          {item.NameCategory}
                        </Option>
                      ))}
                  </Select>
              </Form.Item>
  
              <Form.Item
                label="สภาพสินค้า"
                name="condition"
                rules={[{ required: true, message: "กรุณาเลือกสภาพสินค้า!" }]}
                style={{ marginBottom: "16px" }}
              >
                  <Select size="large" style={{ width: "100%" }} > 
                  {condition.map((item) => (
                        <Option value={item.ID} key={item.NameCondition}>
                          {item.NameCondition}
                        </Option>
                      ))}
                  </Select>
              </Form.Item>
  
              <Form.Item
                label="น้ำหนักสินค้า"
                name="weight"
                style={{ marginBottom: "16px" }}
              >
                <InputNumber placeholder="ไม่จำเป็นต้องระบุ" size="large" style={{ width: "100%" }} />
              </Form.Item>
            </Form>
          </Col>
  
          <Col span={12} 
            style={{
              marginRight:"-70px",
              marginTop:"-80px"
            }}>
              <p 
                style={{
                  display:"flex",
                  fontSize:"15px",
                  alignItems: "center",
                  justifyContent: "center",
                }}>อัปโหลดรูปภาพสินค้าที่นี่</p>
            <Row justify="center" 
              style={{
                grid:"-moz-initial",
              }} > 
              <Upload 
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
            </Row>
          </Col>

          <Row justify="center">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                // onClick={OpenSellerHome}
                style={{
                  backgroundColor: "#212020",
                  borderColor: "#212020",
                  borderRadius: "8px",
                  padding: "0 60px",
                  marginTop:"-75px",
                  marginLeft:"750px",
                }}
              >
                ยืนยัน
              </Button>
            </Row>

            <Row justify="center">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                // onClick={OpenSellerHome}
                style={{
                  width:"160px",
                  backgroundColor: "#ffa24c",
                  borderColor: "#ffa24c",
                  borderRadius: "8px",
                  padding: "0 60px",
                  marginTop:"-90px",
                  marginLeft:"350px",
                  
                }}
              >
                ลบสินค้า
              </Button>
            </Row>
            
        </Row>
      </Card>
    </div>
  </>
  
  );
};

export default CreateProducts;
