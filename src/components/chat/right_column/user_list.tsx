// import styles from "@/styles/right.module.css";
// import { Avatar } from "antd";


// const UserList = (props: any) => {
//     console.log(props);
//     return (
//         <div className={styles.member_list}>
//             {
//                 props.members.map((member: any) => {
//                     return (
//                         <div className={styles.member} id={member.id}>
//                             <Avatar className={styles.member_photo} src={
//                                 props.images.filter( (image: any) => 
//                                     image.id === member.id)[0] === undefined
//                                 ?
//                                     "/headshot/01.svg"
//                                 :
//                                     props.images.filter( (image: any) => 
//                                         image.id === member.id)[0].image
//                             }/>
//                             <div className={styles.member_name}>
//                                 {member.nickname}
//                             </div>
//                         </div>
//                     )
//                 })
//             }
//         </div>
//     )
// }

// export default UserList;

import {List, Avatar, Card, MenuProps, Dropdown} from "antd";
import styles from '@/styles/right.module.css'
import {request} from "@/utils/network";
import {store} from "@/utils/store";


const UserList = (props: any) => {
    console.log(props.members);

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
          key: '1',
          label: (<text>设为群成员</text>),
        },
        {
          key: '2',
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
          key: '2',
          label: (<text>移出群聊</text>),
        },
    ];

    const manager_to_member_items: MenuProps['items'] = [
        {
          key: '0',
          label: (<text>移出群聊</text>),
        },
    ];

    const onDropDownClick_01: any = (applicant_id: any) => {
        return ({key}: any) => {
            if(key === '0') {
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: applicant_id,
                    role: 0
                })).then(_=> {
                    
                });
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: store.getState().userId,
                    role: 1
                })).then(_=> {
                    
                });
            }
            if(key === '1') {
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: applicant_id,
                    role: 2
                })).then(_=> {
                    
                });
            }
            if(key === '2') {
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

    const onDropDownClick_02: any = (applicant_id: any) => {
        return ({key}: any) => {
            if(key === '0') {
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: applicant_id,
                    role: 0
                })).then(_=> {
                    
                });
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: store.getState().userId,
                    role: 1
                })).then(_=> {
                    
                });
            }
            if(key === '1') {
                request("api/session/chatroom/Admin", "PUT", JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.sessionId,
                    applicantId: applicant_id,
                    role: 1
                })).then(_=> {
                    
                });
            }
            if(key === '2') {
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

    const onDropDownClick_12: any = (applicant_id: any) => {
        return ({key}: any) => {
            if(key === '0') {
                request(
                    "/api/session/chatroom",
                    "DELETE",
                    JSON.stringify({
                        userId: applicant_id,
                        sessionId: props.sessionId,
                    })
                ).then((res: any) => {

                });
            }
        };
    };

    const data = props.members.map((member: any) => {
        return {
            name: member.nickname
        }
    })
    return (
        <div>
        <List className={styles.user_list}
            grid={{ column: 1 }}
            itemLayout="vertical"
            dataSource={props.members}
            // bordered={true}
            renderItem={(item: any, index: any) => (
                item.role === 3 ? <div></div> :
                props.role === 0 && item.role === 1 ?
                <List.Item >
                    <Dropdown menu={{ items: master_to_manager_items, onClick: onDropDownClick_01(item.id) }} placement="bottomLeft" trigger={['contextMenu']}>
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
                                description={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "" :
                                member_type((props.members.filter((member: any) => member.id === item.id))[0].role)}
                            />
                        </Card>
                    </Dropdown>
                </List.Item>
                :
                props.role === 0 && item.role === 2 ?
                <List.Item >
                    <Dropdown menu={{ items: master_to_member_items, onClick: onDropDownClick_02(item.id) }} placement="bottomLeft" trigger={['contextMenu']}>
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
                                description={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "" :
                                member_type((props.members.filter((member: any) => member.id === item.id))[0].role)}
                            />
                        </Card>
                    </Dropdown>
                </List.Item>
                :
                props.role === 1 && item.role === 2 ?
                <List.Item >
                    <Dropdown menu={{ items: manager_to_member_items, onClick: onDropDownClick_12(item.id) }} placement="bottomLeft" trigger={['contextMenu']}>
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
                                description={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "" :
                                member_type((props.members.filter((member: any) => member.id === item.id))[0].role)}
                            />
                        </Card>
                    </Dropdown>
                </List.Item>
                :
                <List.Item >
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
                                description={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "" :
                                member_type((props.members.filter((member: any) => member.id === item.id))[0].role)}
                            />
                        </Card>
                </List.Item>
            )}
        />

    </div>);
}

export default UserList;
