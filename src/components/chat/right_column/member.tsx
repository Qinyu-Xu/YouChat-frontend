import React, {useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Checkbox, Input, List, Modal} from 'antd';
import {request} from "@/utils/network";
import {formatParams} from "@/utils/utilities";
import {store} from "@/utils/store"

const AddMember = (props: any) => {

    const [load, setLoad] = useState(true);
    const [friends, setFriends] = useState([]);
    const [selected, setSelected] = useState<any[]>([]);

    console.log(friends);

    useEffect(() => {
        request("api/people/friends?"+formatParams({id: store.getState().userId}), "GET", "").then((res: any) => {
            setFriends(res.friend);
            setFriends((friends) => friends.filter((friend: any) => friend && friend.id !== store.getState().userId));
            setLoad(false);
        })}, [open]);

    const handleOk = () => {
        selected.map(selected_item => {
            request("api/session/chatroom", "POST", JSON.stringify({
                userId: selected_item,
                sessionId: props.sessionId,
            })).then(_=> {console.log(selected_item);
            console.log(props.sessionId);
            request(`api/people/profile/${selected_item}`, "GET", '').then((res: any) => {
                const addM = {
                    "id": selected_item,
                    "nickname": res.profile.nickname,
                    "readTime": Date.now(),
                    "role": 3
                }
                props.setMembers((members: any) => [...members, addM]);
            })
            
        }
            );
        });
            props.setOpen(false);
            
    }
    const handleCancel = () => {
        props.setOpen(false);
    };

    const onChange = (item: any) => {
        return (e: any) => {
            if (e.target.checked) setSelected((selected: any) => [...selected, item.id]);
            else setSelected((selected: any) => selected.filter((x: any) => x !== item.id));
        };
    }
    return (
        <Modal title={"选择好友添加至群聊中"} open={props.open} onOk={handleOk} onCancel={handleCancel}>
            {load
                ?
                (
                    <div>
                    </div>
                    )
                :
                (
                    <div>
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

export default AddMember;
