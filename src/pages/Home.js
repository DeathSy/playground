import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <div>
        <Link to="insurance-mock">Insurance Mock</Link>
      </div>
      <div>
        <Link to="active-ekyc">Active Ekyc</Link>
      </div>
    </>
  );
};
