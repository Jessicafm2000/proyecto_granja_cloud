import React from "react";
import './Logo.css'; // Asegúrate de tener tus estilos

const Logo = () => {
    return (
        <div className="logo">
            <div className="logo-icon">
                {/* Usar el logo desde la carpeta public */}
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
