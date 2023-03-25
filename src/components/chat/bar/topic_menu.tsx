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
    label: any,
    key: any,
    onClick: any,
    icon?: any,
    children?: any,
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

const TopicMenu = ({ selectedKey, changeSelectedKey }: { selectedKey: any, changeSelectedKey: any }) => {

    const items: MenuItem[] = [
        getItem('聊天', '1', changeSelectedKey , <MessageOutlined />),
        getItem('好友', '2', changeSelectedKey,  <TeamOutlined />),
        getItem('设置', '3', changeSelectedKey, <InfoCircleOutlined />, )
    ];

    return (
        <Menu
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="light"
            items={items}
            />
    );
}
export default TopicMenu;