import {Button,Card,Form,Input,message,Flex,Row,Col,InputNumber,DatePicker,Select,} from "antd";

import { useNavigate } from "react-router-dom";

import { CreateMember } from "../../../services/http";

import { MemberInterface } from "../../../interfaces/Member";

import logo from "../../../assets/LogoOrange.png";

import { Link } from "react-router-dom";

import "./Signup.css"



function SignUpPages() {

  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();


  const onFinish = async (values: MemberInterface) => {

    let res = await CreateMember(values);


    if (res.status == 201) {

      messageApi.open({

        type: "success",

        content: res.data.message,

      });

      setTimeout(function () {

        navigate("/");

      }, 2000);

    } else {

      messageApi.open({

        type: "error",

        content: res.data.error,

      });

    }

  };


  return (

    <>

      {contextHolder}

      <Flex justify="center" align="center" className="sign-up">

        <Card className="card-signup" style={{ width: 600 }}>

          <Row align={"middle"} justify={"center"}>

            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
            <center>
              <img alt="logo" src={logo} className="images-logo" />
            </center>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <center>
              <h2 className="header">Sign Up</h2>
            </center>

              <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">

                <Row gutter={[16, 0]} align={"middle"} justify={"center"}>

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="ชื่อจริง"
                      name="first_name"
                      rules={[{required: true,message: "กรุณากรอกชื่อ !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="นามกสุล"
                      name="last_name"
                      rules={[{required: true,message: "กรุณากรอกนามสกุล !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="ชื่อผู้ใช้"
                      name="user_name"
                      rules={[{required: true,message: "กรุณากรอกชื่อผู็ใช้ !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="อีเมล"
                      name="email"
                      rules={[{type: "email",message: "รูปแบบอีเมลไม่ถูกต้อง !",},{required: true,message: "กรุณากรอกอีเมล !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="รหัสผ่าน"
                      name="password"
                      rules={[{required: true,message: "กรุณากรอกรหัสผ่าน !",},]}>
                      <Input.Password />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="เบอร์โทรศัพท์"               
                      name="phonenumber"
                      rules={[{pattern: /^[0-9]{10}$/,required: true,message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item>
                      <center>
                        <Button type="primary" htmlType="submit" className="signuppage-button" style={{ marginBottom: 20 }}>
                          Sign up
                        </Button>
                        <Link to="/">
                          <Button type="primary" htmlType="submit" className="cancel-button" style={{ marginBottom: 20 }}>
                            Cancel
                          </Button>
                        </Link>
                      </center>
                    </Form.Item>
                  </Col>

                </Row>

              </Form>

            </Col>

          </Row>

        </Card>

      </Flex>

    </>

  );

}

export default SignUpPages;