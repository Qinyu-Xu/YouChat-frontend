import {List} from "antd";


const UserList = (props: any) => {
    const data = props.members.map((member: any) => {
        return {
            name: member.nickname
        }
    })
    return (<div>

        <List
            itemLayout="horizontal"
            dataSource={data}
            bordered={true}
            renderItem={(item, index) => (
                <List.Item>
                    {item.name}
                </List.Item>
            )}
        />

    </div>);
}

export default UserList;