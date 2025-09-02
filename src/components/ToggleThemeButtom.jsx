import React from "react";
import { Button } from "antd";
import {HiOutlineSun, HiOutlineMoon} from 'react-icons/hi';

const ToggleThemeButtom = ({darkTheme , toggleTheme}) => {
    return (
    <div className="toggle-them-btn">
        <Button onClick={toggleTheme}>
            {darkTheme ? <HiOutlineSun/> : 
            <HiOutlineMoon/>}
        </Button>
    </div>
    );
};

export default ToggleThemeButtom;