import React from "react";
import {
    MessageOutlined,
    TeamOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import {Menu} from "antd";
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label,
    key,
    onClick,
    icon?,
    children?,
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        onClick,
        children,
        label,
        type,
    } as MenuItem;
}

const TopicMenu = ({ selectedKey, changeSelectedKey }) => {

    const items: MenuItem[] = [
        getItem('聊天', '1', changeSelectedKey , <MessageOutlined />),
        getItem('好友', '2', changeSelectedKey,  <TeamOutlined />),
        getItem('设置', '3', changeSelectedKey, <InfoCircleOutlined />, [
            getItem('修改信息','4', changeSelectedKey),
            getItem('注销账户','5', changeSelectedKey),
        ])
    ];

    return (
        <Menu
            selectkeys={selectedKey}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="light"
            items={items}
            />
    );
}
export default TopicMenu;