import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, Layout, theme } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

// Componentes propios
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import ToggleThemeButton from './components/ToggleThemeButtom';

// Páginas
import Home from './pages/Home';
import Animals from './pages/Animals';
import Crops from './pages/Crops';
import Inventory from './pages/Inventory';
import Vaccines from './pages/Vaccines';
import Task1 from './pages/Task1';
import Task2 from './pages/Task2';
import Subtask1 from './pages/Subtask1';
import Subtask2 from './pages/Subtask2';
import Production from './pages/Production';

const { Header, Sider, Content } = Layout;

function App({ signOut, user }) {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', width: '100vw' }}>
        {/* Sidebar */}
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          theme={darkTheme ? 'dark' : 'light'}
          className='sidebar'
          breakpoint="lg"
          collapsedWidth={80}
          style={{ padding: 0, margin:0 , left:-10, top: -10}} // elimina espacio extra
        >
          <Logo collapsed={collapsed} />
          <MenuList darkTheme={darkTheme} />
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </Sider>

        {/* Layout principal */}
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type='text'
              className='toggle'
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <Button
              onClick={signOut}
              style={{ float: "right", marginRight: "2rem", padding: "6px 14px", backgroundColor: "#151870ff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              Sign Out
            </Button>
          </Header>

          {/* Contenido */}
          <Content
            style={{
              margin: 0,               // elimina margen externo
              padding: 24,             // padding interno
              background: colorBgContainer,
              minHeight: '100vh',
              overflow: 'visible',     // evita que hover de tarjetas se corte
            }}
          >
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/animals' element={<Animals />} />
              <Route path='/crops' element={<Crops />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/vaccines' element={<Vaccines />} />
              <Route path='/tasks/task-1' element={<Task1 />} />
              <Route path='/tasks/task-2' element={<Task2 />} />
              <Route path='/tasks/subtasks/1' element={<Subtask1 />} />
              <Route path='/tasks/subtasks/2' element={<Subtask2 />} />
              <Route path='/production' element={<Production />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
