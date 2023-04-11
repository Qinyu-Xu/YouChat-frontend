import React, {useEffect, useState} from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Button, Checkbox, Dropdown, Input, List, message, Modal, Space} from 'antd';
import {request} from "@/utils/network";
import {formatParams} from "@/utils/utilities";
import {store} from "@/utils/store"

const CreateSession = (props: any) => {

    const [load, setLoad] = useState(true);
    const [friends, setFriends] = useState(null);
    const [selected, setSelected] = useState([store.getState().userId]);
    const [name, setName] = useState('');

    useEffect(() => {
        request("api/friend"+formatParams({id: store.getState().id}), "GET", "").then((res: any) => {
            setFriends(res.friend);
            setLoad(false);
        })}, [])

    const handleOk = () => {
        request("api/session/chatroom", "PUT", JSON.stringify({
            userId: store.getState().userId,
            sessionId: name,
            inital: selected,
        })).then(_=>props.setOpen(false));
    }

    const handleCancel = () => {
        props.setOpen(false);
    };

    return (

        <Modal title={"选择好友创建一个群聊"} open={props.open} onOk={handleOk} onCancel={handleCancel}>
            {load
                ?
                (
                    <div>
                    </div>
                    )
                :
                (
                    <div>
                        输入群聊名称:<Input onChange={(e: any) => setName(e.target.value)}></Input>
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{pageSize: 3,}}
                            dataSource={friends}
                            renderItem={(item) => (
                                <List.Item key={item.id}>
                                    <Checkbox onchange={(e) => {
                                        if(e.target.checked) setSelected((selected: any) => [...selected, item.id])
                                        else setSelected((selected: any) => selected.filter((x: any) => x !== item.id))
                                    }}/>
                                    {item.username}
                                </List.Item>
                            )}
                        />
                    </div>
                )})
                )
            }
        </Modal>

    );
};

const items: MenuProps['items'] = [
    {
        label: '创建群聊',
        key: '1',
    },
];

const UpperBar = () => {

    const [open, setOpen] = useState(false);
    const onClick: MenuProps['onClick'] = ({ key }) => {
        if( key === '1' ) setOpen(true);
    };

    return (
        <div>
            <Dropdown menu={{ items, onClick }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        更多操作
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
            <CreateSession open={open} setOpen={setOpen}/>
        </div>
    )
}

export default UpperBar;