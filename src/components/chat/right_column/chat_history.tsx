import {Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps} from "antd";
import {useState} from "react";

const { RangePicker } = DatePicker;

const AllPicker = () => {
    return <div>

    </div>
};

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

const TypePicker = () => {
    const handleChange = () => {};
    const options: any = [
        { value: '文本', label: 'text' },
        { value: '图片', label: 'image' },
        { value: '语音', label: 'audio' },
    ]
    return <div>
        <Select
            defaultValue="text"
            style={{ width: 120 }}
            onChange={handleChange}
            options={options}
        />
    </div>
}

const MemberPicker = (props: any) => {

    const options: any = props.members.map((member: any) => {
        return {
            label: member.nickname,
            value: member.id
        }
    });
    const default_val = options[0];
    const handleChange = (e: any) => {console.log(e);};

    return <div>
        <Select
            mode="multiple"
            style={{ width: '50%' }}
            allowClear
            defaultValue={default_val}
            onChange={handleChange}
            options={options}
        />
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
        }, {
            label: '按时间顺序',
            key: 'time',
        }, {
            label: '按发送成员',
            key: 'member',
        },
    ];

    const [current, setCurrent] = useState('all');
    const onClick: MenuProps['onClick'] = (e: any) => setCurrent(e.key);
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);

    return (
        <Modal title={"筛选聊天记录"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <br />
            {current === 'all'
                ? <AllPicker />
                : (current === 'type'
                    ? <TypePicker />
                    : (current === 'time'
                        ? <TimestampPicker />
                        : <MemberPicker members={props.members}/>
                        )
                    )
            }
        </Modal>
    )
}

export default ChatHistory;