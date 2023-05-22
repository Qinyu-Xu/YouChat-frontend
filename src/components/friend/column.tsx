import { useEffect, useState } from 'react';
import { request } from "@/utils/network";
import styles from '@/styles/layout.module.css'
import { useCookies } from 'react-cookie';
import {Avatar, Skeleton, Spin} from "antd";

interface User {
	id: number,
	nickname: string,
}

interface Group {
	group: string,
	list: Array<User>,
}

interface FriendListProps {
	groups?: Array<Group>,
	setProfile?: any,
}


const Image = (props : any) => {
    const [image, setImage] = useState("");
    
    useEffect(() => {
        request("api/people/img/" + props.id, "GET", "").then((r: any) => {
            setImage(r.img);
        });
    }, []);

    return (
		<Avatar className={styles.column_item_left} src={image}/>
	);
}

const FriendList = (props: FriendListProps) => {
	const List: any[] = [];

	const handleSelect = async (e: any) => {
		const url = "api/people/profile/" + e.target.id;
        try {
            const response = await request(
                url,
                "GET",
                "",
            );
			props.setProfile(response?.profile);
        } catch(err) {
            console.log(err);
        }
	};

	props.groups?.forEach(g => {
		List.push(
			<div className={styles.group_name}>
				{g.group}
			</div>
		)
		g.list.forEach(item => {
			List.push(
				<div className={styles.column_item} key={item.id.toString()} 
				id={item.id.toString()} onClick={handleSelect}>
					<Image className={styles.column_item_left} id={item.id}/>
					{item.nickname}
				</div>
			)
		})
	});

	return (
		<div>
			{List}
		</div>
	);
};

interface ColumnProps {
	setProfile?: any;
}

function Column(props: ColumnProps) {
	const [query, setQuery] = useState("");
	const [friends, setFriends] = useState<Array<Group>>();
	const [load, setLoad] = useState(false);

	const handleQuery = async () => {
		const url = "api/people/friends/" + (query == "" ? "*" : query);
        try {
            const response = await request(
                url,
                "GET",
                "",
            );
			setFriends(response?.friendList);
			setLoad(true);
        } catch(err) {
            console.log(err);
        }
	};

	useEffect(() => { handleQuery(); }, []);

	return load ?
		(
		<div className={styles.column}>
			<div className={styles.column_search}>
				<input className={styles.search_bar}
                    type="text"
					placeholder="Press Enter to Search"
                    onChange={(e) => { setQuery(e.target.value); }}
					onKeyDown={(e) => { if (e.key === 'Enter') handleQuery(); }}
                    value={query}
				/>
			</div>
			<FriendList groups={friends} setProfile={props.setProfile}/>
		</div>
		)
		:
		(
			<div className={styles.column}>
				<Spin />
			</div>
		)
		;
};

export default Column;