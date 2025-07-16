import { FaYoutube, FaTwitter, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#0e1320" }} className="text-white py-3">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        {/* Left */}
        <div className="small mb-2 mb-md-0">©2022 All Rights Reserved.</div>

        {/* Center */}
        <div className="d-flex gap-3 mb-2 mb-md-0">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <FaYoutube />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <FaTwitter />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <FaFacebookF />
          </a>
        </div>

        {/* Right */}
        <div className="d-flex gap-3 small">
          <a href="https://github.com" className="text-white text-decoration-none">Contact us</a>
          <a href="https://github.com" className="text-white text-decoration-none">Privacy Policies</a>
          <a href="https://github.com" className="text-white text-decoration-none">Help</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
