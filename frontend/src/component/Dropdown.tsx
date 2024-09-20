import "./dropdown.css";   

const Dropdown = () => {
  return (
    <div className="dropdown">
      <div className="content">
        <span className="material-symbols-outlined">settings</span>
        <p>Settings</p>
        <span className="material-symbols-outlined">expand_more</span>
      </div>
      <button type="button"></button>
      <div className="menu">
        <a href="#">
          <span className="material-symbols-outlined">lock</span>
          <p>Account</p>
        </a>
        <a href="#">
          <span className="material-symbols-outlined">credit_card</span>
          <p>Payments</p>
        </a>
        <a href="#">
          <span className="material-symbols-outlined">archive</span>
          <p>Archive</p>
        </a>
      </div>
    </div>
  );
};

export default Dropdown;
