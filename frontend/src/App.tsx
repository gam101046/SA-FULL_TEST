// import React, { useState } from 'react';
// import ConfigRoutes from "./routes";
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { Menu, Layout, theme, MenuProps } from 'antd';
// import {
//   UserOutlined,
//   HomeOutlined,
//   WechatOutlined,
//   UnorderedListOutlined,
//   ShopOutlined,
// } from '@ant-design/icons';
// import Navbar from './pages/Products/Buy-Products/BuyProducts';
// import Index from './pages/Products/Orders/Orders';
// import Index1 from './pages/Products/Purchase-list/PurchaseList';
// import Index2 from './pages/Products/MyProducts/MyProducts';
// import logo from '/Users/gam/sa-67-song_thor_sut/frontend/public/458749239_1453530818692848_5200534269192406191_n.png';
// import HomeMember from './pages/Home/Member/homemember';
// import './App.css';

// const { Header, Content, Sider } = Layout;

// type MenuItem = {
//   key: string;
//   icon?: React.ReactNode;
//   children?: MenuItem[];
//   label: React.ReactNode;
//   link?: string; // เพิ่ม link ที่นี่
// };

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   link?: string
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     link,
//   } as MenuItem;
// }

// const items: MenuItem[] = [
//   {
//     key: 'sub4',
//     label: '',
//     icon: <UnorderedListOutlined />,
//     children: [
//       { key: '1', label: 'บัญชีของฉัน', icon: <UserOutlined />, link: '/profile' },
//       { key: '2', label: 'คำสั่งซื้อของฉัน', icon: <UnorderedListOutlined />, link: '/product' },
//       { key: '3', label: 'ร้านค้าของฉัน', icon: <ShopOutlined />, link: '/Myproducts' }, // เพิ่มลิงก์ที่นี่
//     ],
//   },
// ];

// const App: React.FC = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [current, setCurrent] = useState('1');
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();

//   const toggleCollapsed = () => {
//     setCollapsed(!collapsed);
//   };

//   const onClick: MenuProps['onClick'] = (e) => {
//     console.log('click ', e);
//     setCurrent(e.key);
//   };

//   return (
//     <Router>
//       <ConfigRoutes/>
//       <Layout style={{ minHeight: '130vh' }}>
//         <Sider
//           collapsible
//           collapsed={collapsed}
//           onCollapse={(value) => setCollapsed(value)}
//         >
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'center',
//               marginTop: 20,
//               marginBottom: 20,
//             }}
//           >
//             <img
//               src={logo}
//               alt="Logo"
//               style={{ width: '100%' }}
//             />
//           </div>
//           <Menu
//             theme="dark"
//             mode="inline"
//           >
//             <Menu.Item key="dashboard">
//               <Link to="/">
//                 <HomeOutlined />
//                 <span>หน้าหลัก</span>
//               </Link>
//             </Menu.Item>
//             <Menu.Item key="index1">
//               <Link to="/index">
//                 <WechatOutlined />
//                 <span>แชท</span>
//               </Link>
//             </Menu.Item>
//             <Menu.Item key="index">
//               <Link to="/product">
//                 <UserOutlined />
//                 <span>ข้อมูลสินค้า</span>
//               </Link>
//             </Menu.Item>
//           </Menu>
//           <Menu
//             defaultSelectedKeys={[current]}
//             defaultOpenKeys={['sub4']} // เปลี่ยนเป็น 'sub4'
//             mode="inline"
//             theme="dark"
//             inlineCollapsed={collapsed}
//             onClick={onClick}
//           >
//             {items.map(item => (
//               <Menu.SubMenu
//                 key={item.key}
//                 icon={item.icon}
//                 title={item.label}
//               >
//                 {item.children?.map(subItem => (
//                   <Menu.Item 
//                     key={subItem.key} 
//                     icon={subItem.icon}
//                     onClick={() => {
//                       if (subItem.link) {
//                         window.location.href = subItem.link;
//                       }
//                     }}
//                   >
//                     {subItem.label}
//                   </Menu.Item>
//                 ))}
//               </Menu.SubMenu>
//             ))}
//           </Menu>
//         </Sider>
//         <Layout>
//           <Header style={{ padding: 0, background: colorBgContainer }} />
//           <Content style={{ margin: '0 16px' }}>
//             <Routes>
//               <Route path="/" element={<Navbar />} />
//               <Route path="/index" element={<Index1 />} />
//               <Route path="/product" element={<Index />} />
//               <Route path="/Myproducts" element={<Index2 />} />
//             </Routes>
//           </Content>
//         </Layout>
//       </Layout>
//     </Router>
//   );
// };

// export default App;



import { BrowserRouter as Router } from "react-router-dom";
import ConfigRoutes from "./routes";

function App() {
  return (
    <div className="App">
      <Router>
        <ConfigRoutes/>
      </Router>
    </div>
  );
}

export default App;