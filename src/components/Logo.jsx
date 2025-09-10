import React from "react";
import './Logo.css';

const Logo = ({ collapsed }) => {
  return (
    <div className={`logo ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-icon">
        <img 
          src="https://d2trfafuwnq9hu.cloudfront.net/logo/granjacloud.png" 
          alt="GranjaCloud Logo" 
          className="cloud-icon" 
        />
      </div>
    </div>
  );
};

export default Logo;
