import React from 'react';

import { Layout } from 'antd';

const SideBar = ({menu}: {menu: any}) => {
    return (
        <Layout.Sider
            breakpoint={"lg"}
            theme="light"
            collapsedWidth={0}
            trigger={null}>
            {menu}
        </Layout.Sider>
    )
}

export default SideBar;
