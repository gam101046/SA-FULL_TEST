
import { useState, useEffect } from "react";
import './ProfileEdit.css';
import logo from '../../../../assets/LogoOrange.png';
import { Button, Form, Input, message, Divider, Upload } from "antd";
import { MemberInterface } from "../../../../interfaces/Member";
import { GetMemberById, UpdateMemberById } from "../../../../services/http";
import { useNavigate, Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function ProfileEdit() {
  const navigate = useNavigate();

  const storedUid = Number(localStorage.getItem("id"));

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [uid, setUid] = useState<number | null>(storedUid);

  const [user, setUser] = useState<MemberInterface>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values: MemberInterface) => {
    if (uid !== null) {
      values.ID = user?.ID;
      const file = fileList[0]?.originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          values.ProfilePic = base64data; // ใช้ base64 สำหรับเก็บรูปที่ครอบแล้ว

          const res = await UpdateMemberById(uid, values); // ตรวจสอบ uid ก่อนที่จะส่ง
          if (res) {
            messageApi.open({
              type: "success",
              content: res.message,
            });
            setTimeout(() => {
              navigate("/Profile");
            }, 2000);
          } else {
            messageApi.open({
              type: "error",
              content: res.message,
            });
          }
        }
      } else {
        // ถ้าไม่มีการอัพโหลดไฟล์ใหม่
        values.ProfilePic = user?.ProfilePic || ""; // เก็บรูปโปรไฟล์เก่าหากไม่มีการอัปโหลดใหม่
        const res = await UpdateMemberById(uid, values);
        if (res) {
          messageApi.open({
            type: "success",
            content: res.message,
          });
          setTimeout(() => {
            navigate("/Profile");
          }, 2000);
        } else {
          messageApi.open({
            type: "error",
            content: res.message,
          });
        }
      }
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบ User ID",
      });
    }
  };

  useEffect(() => {
    const GetMemberid = async () => {
      const res = await GetMemberById(storedUid);
      if (res) {
        setUser(res.data);
        form.setFieldsValue({
          FirstName: res.data.FirstName,
          LastName: res.data.LastName,
          Username: res.data.Username,
          Email: res.data.Email,
          PhoneNumber: res.data.PhoneNumber,
          Address: res.data.Address,
        });
        if (res.data.ProfilePic) {
          setFileList([
            {
              uid: '-1',
              name: 'profile.png', // หรือชื่อไฟล์ที่เหมาะสม
              status: 'done',
              url: res.data.ProfilePic, // ใช้ URL ของรูปโปรไฟล์ที่มีอยู่
            },
          ]);
        }
      }
    };
    setUid(storedUid);
    GetMemberid();
  }, [storedUid, form]);

  return (
    <>
      {contextHolder}
      <div className="profileedit-container">
        <div className="profileedit-box">
          <img src={logo} className="logo-ProfileEdit" alt="Logo" />
          <h2>แก้ไขโปรไฟล์</h2>
          <Divider />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="รูปประจำตัว" name="Profile">
              <ImgCrop aspect={1} rotationSlider>
                <Upload
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  maxCount={1}
                  multiple={false}
                  listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>อัพโหลด</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item label="ชื่อจริง" name="FirstName">
              <Input />
            </Form.Item>

            <Form.Item label="นามสกุล" name="LastName">
              <Input />
            </Form.Item>

            <Form.Item label="ชื่อผู้ใช้" name="Username">
              <Input />
            </Form.Item>

            <Form.Item label="เบอร์โทรศัพท์" name="PhoneNumber">
              <Input />
            </Form.Item>

            <Form.Item label="อีเมล" name="Email">
              <Input />
            </Form.Item>

            <Form.Item label="ที่อยู่" name="Address">
              <Input />
            </Form.Item>

            <Form.Item>
              <center>
                <Button type="primary" htmlType="submit" className="btn update">
                  อัปเดต
                </Button>

                <Link to="/Profile">
                  <Button type="primary" htmlType="button" className="btn cancel">
                    ยกเลิก
                  </Button>
                </Link>
              </center>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default ProfileEdit;
