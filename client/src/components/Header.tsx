import { Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../Store";

type HeaderProps = {
    onSearch?: (value: string) => void;
}
const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === '/'
  const { state, dispatch } = useContext(Store);
  const { userInfo, cart } = state;

  const handleAuthClick = () => {
    if (userInfo) {
      dispatch({ type: "USER_SIGNOUT" });
      navigate("/");
    } else {
      navigate("/signin");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value)
  }

  return (
    <header style={{ backgroundColor: "#0e1320" }} className="text-white py-3">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        {/* Left: Logo */}
        <div className="d-flex align-items-center me-3" role="button" onClick={() => navigate("/home")}>
          <span className="fw-bold fs-5 me-1">Management</span>
          <small style={{ fontSize: "0.8rem" }}>chuwa</small>
        </div>

        {/* Center: Search */}
        {isHomepage && (
        <div className="flex-grow-1 mx-3" style={{ maxWidth: "500px" }}>
          <InputGroup>
            <Form.Control 
                type="text" 
                placeholder="Search" 
                aria-label="Search"
                onChange={handleSearchChange} />
            <InputGroup.Text><FaSearch /></InputGroup.Text>
          </InputGroup>
        </div>
        ) }

        {/* Right: Auth & Cart */}
        <div className="d-flex align-items-center gap-4">
          {/* Sign In/Out */}
          <div role="button" className="d-flex align-items-center" onClick={handleAuthClick}>
            <FaUser className="me-1" />
            <span>{userInfo ? "Sign Out" : "Sign In"}</span>
          </div>

          {/* Cart */}
          <div className="d-flex align-items-center" role="button">
            <FaShoppingCart className="me-1" />
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
