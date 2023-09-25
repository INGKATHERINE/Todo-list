import React from 'react';
import { Avatar, Menu, Dropdown, } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const AccountMenu = () => {
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', paddingRight: '1rem',margin: 7,paddingBottom: '5px',  boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.1)',padding: 5, }}>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 30, fontWeight: 'bold' }}>Panel de Actividades</div>
      {/* <div style={{ marginLeft: '1rem' }}>
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Avatar size={32} icon={<UserOutlined />} />
        </Dropdown>
      </div> */}
    </div>
  );
};

export default AccountMenu;