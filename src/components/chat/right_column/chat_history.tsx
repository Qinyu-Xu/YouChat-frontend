import {Divider, Modal, MenuProps, Menu, DatePicker} from "antd";
import {useState} from "react";

const { RangePicker } = DatePicker;

const TimestampPicker = () => {
    const [begin, setBegin] = useState(null);
    const [end, setEnd] = useState(null);
    const handleChange = (e: any) => {
        setBegin(e[0]);
        setEnd(e[1]);
    }

    return <div>
        <RangePicker showTime onChange={handleChange}/>
    </div>
};

const AllPicker = () => {
    return <div>

    </div>
};

const TypePicker = () => {
    return <div>

    </div>
}

const MemberPicker = () => {
    return <div>
        
    </div>

}

const ChatHistory = (props: any) => {

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
            label: '按时间顺序',
            key: 'time',
        }, {
            label: '按发送成员',
            key: 'member',
            children: props.members.map((member: any) => {
                return {
                    label: member.nickname,
                    key: member.nickname
                };
            })
        },
    ];

    const [current, setCurrent] = useState('all');
    const [keyPath, setKeyPath] = useState('');
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        console.log(e.keyPath);
        if(e.keyPath.length === 1) setKeyPath(e.key);
        else setKeyPath(e.keyPath[1]);

    }
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);

    return (
        <Modal title={"筛选聊天记录"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <br />
            {keyPath === 'all'
                ? <AllPicker />
                : (keyPath === 'type'
                    ? <TypePicker />
                    : (keyPath === 'time'
                        ? <TimestampPicker />
                        : <MemberPicker />
                        )
                    )
            }
        </Modal>
    )
}

export default ChatHistory;