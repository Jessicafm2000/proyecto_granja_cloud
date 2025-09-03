import React from "react";
import { CloudOutlined } from '@ant-design/icons';
import './Logo.css'; // Asegúrate de crear este archivo

const Logo = () => {
    return (
        <div className="logo">
            <div className="logo-icon">
                <CloudOutlined className="cloud-icon" />
            </div>
        </div>
    );
};

export default Logo;
