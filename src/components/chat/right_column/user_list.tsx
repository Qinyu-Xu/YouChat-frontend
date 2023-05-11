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

import {List, Avatar, Card} from "antd";
import styles from '@/styles/right.module.css'


const UserList = (props: any) => {
    // console.log(props.members)

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
