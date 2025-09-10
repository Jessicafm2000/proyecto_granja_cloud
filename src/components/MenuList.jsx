import { Menu } from 'antd';
import { 
  AppstoreAddOutlined, 
  AppstoreOutlined, 
  DiffOutlined, 
  FileDoneOutlined, 
  HomeOutlined, 
  InboxOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";

const MenuList = ({ darkTheme }) => {
  const location = useLocation();
  const selectedKeys = [location.pathname];

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Inicio</Link>,
    },
    {
      key: '/animals',
      icon: <AppstoreAddOutlined />,
      label: <Link to="/animals">Animales</Link>,
    },
    {
      key: '/crops',
      icon: <AppstoreOutlined />,
      label: <Link to="/crops">Cultivos</Link>,
    },
    {
      key: '/production',
      icon: <InboxOutlined />,
      label: <Link to="/production">Producción</Link>,
    },
    {
      key: '/inventory',
      icon: <FileDoneOutlined />,
      label: <Link to="/inventory">Inventario</Link>,
    },
    {
      key: '/vaccines',
      icon: <DiffOutlined />,
      label: <Link to="/vaccines">Vacunación</Link>,
    },
  ];

  return (
    <Menu
      theme={darkTheme ? 'dark' : 'light'}
      mode="inline"
      className="menu-bar"
      selectedKeys={selectedKeys}
      items={menuItems}
    />
  );
};

export default MenuList;
