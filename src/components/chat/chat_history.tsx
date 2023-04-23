import {Divider, Modal, MenuProps, Menu} from "antd";
import {useState} from "react";

const items: MenuProps['items'] = [
    {
        label: '所有',
        key: 'all',
    }, {
        label: '按消息类型',
        key: 'type',
        children: [
            {
                label: '对话',
                key: 'text',
            },
            {
                label: '图片',
                key: 'image',
            },
            {
                label: '语音',
                key: 'audio',
            },
        ],
    }, {
        label: '按发送时间',
        key: 'time',
    }, {
        label: '按发送成员',
        key: 'member',
    },
];

const handleAll = () => {

}

const handleType = () => {

}

const handleUser = () => {

}

const handleTime = () => {

}

const ChatHistory = (props: any) => {

    const [current, setCurrent] = useState('all');
    const onClick: MenuProps['onClick'] = (e) => setCurrent(e.key);
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);

    return (
        <Modal title={"筛选聊天记录"} open={props.open} onOk={handleOk} onCancel={handleCancel}>
            <Divider />
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <Divider />
        </Modal>
    )
}

export default ChatHistory;