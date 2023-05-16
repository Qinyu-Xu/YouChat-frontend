import React, {useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Checkbox, Input, List, Modal} from 'antd';
import {request} from "@/utils/network";
import {formatParams} from "@/utils/utilities";
import {store} from "@/utils/store"

const AddGroup = (props: any) => {

    // console.log(props.members);

    const [load, setLoad] = useState(true);
    const [friends, setFriends] = useState([]);
    const [selected, setSelected] = useState<any[]>([store.getState().userId, props.members.filter((x: any) => x.id !== store.getState().userId)[0].id]);
    const [name, setName] = useState('');

    useEffect(() => {
        request("api/people/friends?"+formatParams({id: store.getState().userId}), "GET", "").then((res: any) => {
            setFriends(res.friend);
            setFriends((friends) => friends.filter((friend: any) => friend && friend.id !== store.getState().userId));
            setLoad(false);
        })}, [open]);

    const handleOk = () => {
        request("api/session/chatroom", "PUT", JSON.stringify({
            userId: store.getState().userId,
            sessionName: name,
            initial: selected,
        })).then(_=> {
            props.setOpen(false);
            props.setRefresh((s: any) => !s);
        });
    }

    const handleCancel = () => {
        props.setOpen(false);
    };

    const onChange = (item: any) => {
        return (e: any) => {
            console.log(selected);
            if (e.target.checked) setSelected((selected: any) => [...selected, item.id]);
            else setSelected((selected: any) => selected.filter((x: any) => x !== item.id));
        };
    }
    return (
        <Modal title={"创建群聊"} open={props.open} onOk={handleOk} onCancel={handleCancel}>
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
                            renderItem={(item: any) => (
                                <List.Item key={item.id}>
                                    {props.members.filter((x: any) => x.id === item.id).length === 0 
                                    ?
                                    <Checkbox onChange={onChange(item)}>
                                    </Checkbox>
                                    :
                                    <Checkbox defaultChecked={true} disabled />
                                    }
                                    {item.userName}
                                </List.Item>
                            )}
                        />
                    </div>
                )}
        </Modal>
    );
};

export default AddGroup;
