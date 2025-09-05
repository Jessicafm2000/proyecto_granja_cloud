import React from "react";
import './Logo.css'; // Asegúrate de tener tus estilos

const Logo = () => {
    return (
        <div className="logo">
            <div className="logo-icon">
                {/* Usar el logo desde la carpeta public */}
                <img 
                    src="https://granjacloud.s3.us-east-1.amazonaws.com/logo/granjacloud.png" 
                    alt="GranjaCloud Logo" 
                    className="cloud-icon" 
                />
            </div>
        </div>
    );
};

export default Logo;
