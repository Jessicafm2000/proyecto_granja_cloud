//import React from "react";
import {Menu} from 'antd';
import {AppstoreAddOutlined, AppstoreOutlined, BarsOutlined, DiffFilled, DiffOutlined, FileDoneOutlined, HomeOutlined} from '@ant-design/icons';

const MenuList = ({darkTheme}) => {
    return(
        <Menu theme={darkTheme ? 'dark' : 'light'} mode='inline' className='menu-bar'>
            <Menu.Item key="home" icon={<HomeOutlined />}>
                Home
            </Menu.Item>
            <Menu.Item key="animals" icon={<AppstoreAddOutlined/>}>
                Animales
            </Menu.Item>
            <Menu.SubMenu key="tasks"
            icon={<BarsOutlined/>}
            title="Tasks"
            >
            <Menu.Item key="task-1">Task-1</Menu.Item>
            <Menu.Item key="task-2">Task-2</Menu.Item>
            <Menu.SubMenu key='subtasks' title='Subtasks'>
                <Menu.Item key="subtask-1">subtask 1</Menu.Item>
                <Menu.Item key="subtask-2">subtask 2</Menu.Item>
            </Menu.SubMenu>
            </Menu.SubMenu>
            <Menu.Item key="crops" icon={<AppstoreOutlined />}>
                Cultivos
            </Menu.Item>
             <Menu.Item key="inventory" icon={<FileDoneOutlined/>}>
                Inventario
            </Menu.Item>
            <Menu.Item key="vaccines" icon={<DiffOutlined />}>
                Vacunación
            </Menu.Item>
        </Menu>
    );
};

export default MenuList;