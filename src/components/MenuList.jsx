
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
            <Menu.SubMenu key="tasks"
            icon={<BarsOutlined/>}
            title="Tasks"
            >
            <Menu.Item key="/tasks/task-1">
                <Link to="/tasks/task-1">Task-1</Link>
            </Menu.Item>
            <Menu.Item key="/tasks/task-2">
                <Link to="/tasks/task-2">Task-2</Link>
            </Menu.Item>
            <Menu.SubMenu key='subtasks' title='Subtasks'>
                <Menu.Item key="/tasks/subtask-1">
                    <Link to="/tasks/subtasks/1">subtask 1</Link>
                </Menu.Item>
                <Menu.Item key="/tasks/subtask-2">
                     <Link to="/tasks/subtasks/2">subtask 2</Link>
                </Menu.Item>
            </Menu.SubMenu>
            </Menu.SubMenu>
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