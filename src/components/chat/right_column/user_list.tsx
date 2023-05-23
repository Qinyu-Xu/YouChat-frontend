import React, {useEffect, useState} from 'react';
import {List, Avatar, Card, MenuProps, Dropdown, message} from "antd";
import styles from '@/styles/right.module.css'
import {request} from "@/utils/network";
import {store} from "@/utils/store";
import {formatParams} from "@/utils/utilities";


const UserList = (props: any) => {

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        request("api/people/friends?"+formatParams({id: store.getState().userId}), "GET", "").then((res: any) => {
            setFriends(res.friend);
            // setFriends((friends) => friends.filter((friend: any) => friend && friend.id !== store.getState().userId));
        })}, []);

    const member_type = (role: number) => {
        if (role === 0) {
            return "群主";
        }
        if (role === 1) {
            return "管理员";
        }
        if (role === 2) {
            return "群成员";
        }
        if (role === 3) {
            return "待批准";
        }
    }
    
    const master_to_manager_items: MenuProps['items'] = [
        {
          key: '0',
          label: (<text>转让群主</text>),
        },
        {
          key: '2',
          label: (<text>设为群成员</text>),
        },
        {
          key: '4',
          label: (<text>移出群聊</text>),
        },
    ];

    const master_to_member_items: MenuProps['items'] = [
        {
          key: '0',
          label: (<text>转让群主</text>),
        },
        {
          key: '1',
          label: (<text>设为管理员</text>),
        },
        {
          key: '4',
          label: (<text>移出群聊</text>),
        },
    ];

    const manager_to_member_items: MenuProps['items'] = [
        {
          key: '4',
          label: (<text>移出群聊</text>),
        },
    ];

    const master_to_manager_items_friend: MenuProps['items'] = [
        {
          key: '0',
          label: (<text>转让群主</text>),
        },
        {
          key: '2',
          label: (<text>设为群成员</text>),
        },
        {
          key: '3',
          label: (<text>添加好友</text>),
        },
        {
          key: '4',
          label: (<text>移出群聊</text>),
        },
    ];

    const master_to_member_items_friend: MenuProps['items'] = [
        {
          key: '0',
          label: (<text>转让群主</text>),
        },
        {
          key: '1',
          label: (<text>设为管理员</text>),
        },
        {
          key: '3',
          label: (<text>添加好友</text>),
        },
        {
          key: '4',
          label: (<text>移出群聊</text>),
        },
    ];

    const manager_to_member_items_friend: MenuProps['items'] = [
        {
          key: '3',
          label: (<text>添加好友</text>),
        },
        {
          key: '4',
          label: (<text>移出群聊</text>),
        },
    ];

    const only_friend: MenuProps['items'] = [
        {
          key: '3',
          label: (<text>添加好友</text>),
        },
    ];
    const nothing: MenuProps['items'] = [

    ];

    const onDropDownClick: any = (applicant_id: any) => {
        return ({key}: any) => {
            if(key === '0') {
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: applicant_id,
                    role: 0
                })).then(_=> {
                    props.setMembers((members: any) => members.map((member: any) => {
                        return member.id === applicant_id
                            ?
                            {
                                id: member.id,
                                nickname: member.nickname,
                                readTime: member.readTime,
                                role: 0
                            }
                            : member;
                    }));
                    request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                        userId: store.getState().userId,
                        sessionId: props.sessionId,
                        applicantId: store.getState().userId,
                        role: 1
                    })).then(_=> {
                        props.setMembers((members: any) => members.map((member: any) => {
                            return member.id === store.getState().userId
                                ?
                                {
                                    id: member.id,
                                    nickname: member.nickname,
                                    readTime: member.readTime,
                                    role: 1
                                }
                                : member;
                        }));
                        props.setRole(1);
                    });
                });
            }
            if(key === '1') {
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: applicant_id,
                    role: 1
                })).then(_=> {
                    props.setMembers((members: any) => members.map((member: any) => {
                        return member.id === applicant_id
                            ?
                            {
                                id: member.id,
                                nickname: member.nickname,
                                readTime: member.readTime,
                                role: 1
                            }
                            : member;
                    }));
                });
            }
            if(key === '2') {
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: applicant_id,
                    role: 2
                })).then(_=> {
                    props.setMembers((members: any) => members.map((member: any) => {
                        return member.id === applicant_id
                            ?
                            {
                                id: member.id,
                                nickname: member.nickname,
                                readTime: member.readTime,
                                role: 2
                            }
                            : member;
                    }));
                });
            }
            if(key === '3') {
                request(
                    "api/people/friends",
                    "PUT",
                    JSON.stringify({
                        "id": applicant_id,
                        "group": "RequestTo",
                    }),
                ).then((res: any) => {
                    message.success("好友申请已发送！");
                });
            }
            if(key === '4') {
                request(
                    "/api/session/chatroom",
                    "DELETE",
                    JSON.stringify({
                        userId: applicant_id,
                        sessionId: props.sessionId,
                    })
                ).then((res: any) => {
                    let old_members: any[] = props.members;
                    old_members = old_members.filter((member: any) => member.id !== applicant_id);
                    props.setMembers([...old_members]);
                });
            }
        };
    };

    return (
        <div>
        <List className={styles.user_list}
            grid={{ column: 1 }}
            itemLayout="vertical"
            dataSource={props.members}
            // bordered={true}
            renderItem={(item: any, index: any) => (
                item.role === 3 ? <div></div> :
                <List.Item >
                    <Dropdown menu={{ items: (friends.filter((friend: any) => friend && friend.id === item.id).length === 1 || item.id === store.getState().userId) ? 
                    (props.role === 0 && item.role === 1
                        ? 
                        master_to_manager_items 
                        : 
                        props.role === 0 && item.role === 2
                        ?
                        master_to_member_items
                        :
                        props.role === 1 && item.role === 2
                        ?
                        manager_to_member_items
                        :
                        nothing
                        ) : 
                    (props.role === 0 && item.role === 1
                        ? 
                        master_to_manager_items_friend
                        : 
                        props.role === 0 && item.role === 2
                        ?
                        master_to_member_items_friend
                        :
                        props.role === 1 && item.role === 2
                        ?
                        manager_to_member_items_friend
                        :
                        only_friend
                        )
                        , onClick: onDropDownClick(item.id) }} placement="bottomLeft" trigger={['contextMenu']}>
                        <Card>
                            <List.Item.Meta
                                avatar={<Avatar src={
                                    !props.images.hasOwnProperty(item.id) ?"/headshot/01.svg" :props.images[item.id]
                                } />}
                                title={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "Stranger" :
                                (props.members.filter((member: any) => member.id === item.id))[0].nickname}
                                description={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "" :
                                member_type((props.members.filter((member: any) => member.id === item.id))[0].role)}
                            />
                        </Card>
                    </Dropdown>
                </List.Item>
            )}
        />

    </div>);
}

export default UserList;
