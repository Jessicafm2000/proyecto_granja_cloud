import { useState } from 'react';
//import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Button, Layout, theme} from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import ToggleThemeButton from './components/ToggleThemeButtom';

import Home from './pages/Home';
import Animals from './pages/Animals';
import Crops from './pages/Crops';
import Inventory from './pages/Inventory';
import Vaccines from './pages/Vaccines';
import Task1 from './pages/Task1';
import Task2 from './pages/Task2';
import Subtask1 from './pages/Subtask1';
import Subtask2 from './pages/Subtask2';
import Production from './pages/Production'


const {Header, Sider , Content} = Layout;
function App() {
  const [darkTheme, setDarkTheme] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  const toggleTheme = () =>{
    setDarkTheme(!darkTheme);
  };

  const{
    token: {colorBgContainer},
  }=theme.useToken()

  return (
     <Router>
      <Layout>
        <Sider collapsed={collapsed} collapsible trigger={null} theme={darkTheme ? 'dark' : 'light'} 
        className='sidebar'>
          <Logo/>
          <MenuList darkTheme = {darkTheme}/>
          <ToggleThemeButton darkTheme={darkTheme}
          toggleTheme={toggleTheme}/>
        </Sider>
        <Layout>
          <Header style={{padding: 0, background:colorBgContainer}}>
            <Button type='text'  className= 'toggle' onClick={()=>setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/> }/>
          </Header>
           <Content style={{ margin: 16, background: colorBgContainer, padding: 16 }}>
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

export default App
