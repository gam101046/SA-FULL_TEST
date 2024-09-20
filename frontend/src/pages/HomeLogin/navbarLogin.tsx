import "./NavbarLogin.css";
import { ChatCircleDots, ShoppingCart, BellRinging, List } from "phosphor-react";
import Logo from "../../assets/logo copy.png";


const NavbarLogin = () => {
  return (
    <div className='navbar'>
      <img src={Logo} className='logo' alt='Course Logo' />
      <div className='right-section'>
        <div className='links'>
          <div className="search">
            <input type="text" placeholder="search" />
          </div>
          <button className="button-login">สร้างการขายสินค้า</button>
          <ChatCircleDots size={32} className="icon chat-icon" />
          <ShoppingCart size={32} className="icon cart-icon" />
          <List size={32} className="icon list-icon" />
          <BellRinging size={32} className="icon bell-icon" />
        </div>
      </div>
    </div>
  );
}

export default NavbarLogin;