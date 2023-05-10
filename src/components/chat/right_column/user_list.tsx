import styles from "@/styles/right.module.css";
import { Avatar } from "antd";


const UserList = (props: any) => {
    console.log(props);
    return (
        <div className={styles.member_list}>
            {
                props.members.map((member: any) => {
                    return (
                        <div className={styles.member} id={member.id}>
                            <Avatar className={styles.member_photo} src={
                                props.images.filter( (image: any) => 
                                    image.id === member.id)[0] === undefined
                                ?
                                    "/headshot/01.svg"
                                :
                                    props.images.filter( (image: any) => 
                                        image.id === member.id)[0].image
                            }/>
                            <div className={styles.member_name}>
                                {member.nickname}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default UserList;