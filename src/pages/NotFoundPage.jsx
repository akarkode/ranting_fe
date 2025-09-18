import { Link } from "react-router-dom";
import "./../styles/NotFoundPage.css";
import notFoundImg from "../assets/not-found.png";

export default function NotFoundPage() {
  return (
    <div className="notfound-container">
      <img src={notFoundImg} alt="404" className="notfound-img" />
      <h1>Oops! Page not found</h1>
      <p>The page you are looking for doesn’t exist or has been moved.</p>
      <Link to="/" className="back-home">⬅ Back to Home</Link>
    </div>
  );
}
