import React, { useEffect, useState } from "react";
import "./Header.css";
import CoronaRed from "../../assets/icon/corona-icon-red.png";
import Covid19Api from "../../Api/Covid19/Covid19Api";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [updateTime, setUpdateTime] = useState();
  useEffect(() => {
    const fetchDataGlobal = async () => {
      try {
        const res = await Covid19Api.getGlobal();
        const updated = new Date(res.updated);
        const dateTime = `${updated.toLocaleDateString()} (${updated.toLocaleTimeString()})`;
        setUpdateTime(dateTime);
      } catch (error) {
        throw error;
      }
    };
    fetchDataGlobal();
  }, []);
  return (
    <header className="header-wrapper">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-3">
            <div className="logo-wrap">
              <Link className="logo-link" to="/">
                <img src={CoronaRed} className="logo" alt="logo" />
                <span className="logo-caption">Covid19</span>
              </Link>
            </div>
          </div>

          <div className="col-md-5 col-lg-3">
            <div className="last-update-wrap">
              <p className="mb-0">
                Cập nhật: <span className="last-update">{updateTime}</span>
              </p>
            </div>
          </div>

          <div className="col-md-7 col-lg-6">
            <div className="navbar-wrap">
              <nav className="menubar">
                <ul className="nav">
                  <li>
                    <NavLink to="/thong-ke">Thống kê</NavLink>
                  </li>
                  <li>
                    <NavLink to="/">Bản đồ</NavLink>
                  </li>
                  <li>
                    <NavLink to="/khai-bao-y-te">Khai báo y tế</NavLink>
                  </li>
                  <li>
                    <a href="https://ncovblog.000webhostapp.com/">Tin tức</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
