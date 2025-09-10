import React from "react";
import { Button } from "antd";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const ToggleThemeButton = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle-theme-btn">
      <Button
        style={{ right:50,top:50, float: "right", marginRight: "2rem", padding: "6px 14px", backgroundColor: "#151870ff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        type="text"
        className="theme-toggle-button"
        onClick={toggleTheme}
      >
        {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </div>
  );
};

export default ToggleThemeButton;


//