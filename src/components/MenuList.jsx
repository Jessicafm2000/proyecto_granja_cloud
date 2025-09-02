
//import React from "react";
import {Menu} from 'antd';
import {AppstoreAddOutlined, AppstoreOutlined, BarsOutlined, DiffFilled, DiffOutlined, FileDoneOutlined, HomeOutlined} from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";


const MenuList = ({darkTheme}) => {
    
    const location = useLocation();
    const selectedKeys = [location.pathname]; 
    return(
        <Menu theme={darkTheme ? 'dark' : 'light'} mode='inline' className='menu-bar' selectedKeys={selectedKeys}>
            <Menu.Item key="/" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/animals" icon={<AppstoreAddOutlined/>}>
                <Link to="/animals">Animales</Link>
            </Menu.Item>
            <Menu.Item key="/production" icon={<AppstoreOutlined />}>
                 <Link to="/production">Producción</Link>
            </Menu.Item>
            <Menu.Item key="/crops" icon={<AppstoreOutlined />}>
                 <Link to="/crops">Cultivos</Link>
            </Menu.Item>
             <Menu.Item key="/inventory" icon={<FileDoneOutlined/>}>
                <Link to="/inventory">Inventario</Link>
            </Menu.Item>
            <Menu.Item key="/vaccines" icon={<DiffOutlined />}>
                <Link to="/vaccines">Vacunación</Link>
            </Menu.Item>
        </Menu>
    );
};

export default MenuList;