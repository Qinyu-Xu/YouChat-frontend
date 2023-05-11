import styles from "@/styles/right.module.css";
import {Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar, Input, Button, Card } from "antd";
import {useEffect, useState} from "react";
import {isBrowser, store} from "@/utils/store";
import CircularJson from "circular-json";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import { request } from "@/utils/network";

const RequestList = (props: any) => {

    const handleOk = (applicant_id: number) => {
        request("api/session/chatroom/Admin", "PUT", JSON.stringify({
            userId: store.getState().userId,
            sessionId: props.sessionId,
            applicantId: applicant_id,
        })).then(_=> {
            props.setOpen(false);
            const item = document.getElementById("mySidenav");
            if(item) {
                if (item.style.right === "-20rem") item.style.right = "0px";
                else if(item.style.right === "0px") item.style.right = "-20rem";
                else item.style.right = "0px";
            }
        });
    }

    return <div>
        <List 
            grid={{ column: 1 }}
            itemLayout="vertical"
            //dataSource={props.members}
            dataSource={props.members.filter((x: any) => x.role === 3)}
            // bordered={true}
            renderItem={(item: any, index: any) => (
                <List.Item onClick={() => {}}>
                    <Card>
                            <List.Item.Meta
                                avatar={<Avatar src={
                                    props.images.filter( (image: any) => image.id === item.id)[0] === undefined
                                        ? "/headshot/01.svg"
                                        : props.images.filter( (image: any) => image.id === item.id)[0].image
                                } />}
                                title={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "Stranger" :
                                (props.members.filter((member: any) => member.id === item.id))[0].nickname}
                            />
                            <Button type="primary" onClick={() => handleOk(item.id)}>同意</Button>
                            <Button>拒绝</Button>
                    </Card>
                </List.Item>
            )}
        />

    </div>
};

const Manager = (props: any) => {

    const items: MenuProps['items'] = [
        {
            label: '加群申请',
            key: 'view',
        }, 
    ];

    const [current, setCurrent] = useState('view');
    const [messages, setMessages] = useState([]);

    const onClick: MenuProps['onClick'] = (e: any) => setCurrent(e.key);
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);

    

    return (
        <Modal title={"同意加群申请"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            
            <br />
            <RequestList members={props.members} messages={messages} images={props.images} setOpen={props.setOpen} sessionId={props.sessionId} setSession={props.setSession}/>
        </Modal>
    )
}

export default Manager;