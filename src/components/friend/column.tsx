import { useEffect, useState } from 'react';
import { request } from "@/utils/network";
import styles from '@/styles/layout.module.css'
import { useCookies } from 'react-cookie';

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

const FriendList = (props: FriendListProps) => {
	const List: any[] = [];
    const [cookies] = useCookies(['token']);

	const handleSelect = async (e: any) => {
		console.log(e);
		const url = "api/people/profile/" + e.target.id;
		console.log(url);
        try {
            const response = await request(
                url,
                "GET",
                cookies,
            );
			props.setProfile(response?.profile);
			console.log(response.profile);
        } catch(err) {
            console.log(err);
        }
	};

	props.groups?.map(g => {
		g.list.map(item => {
			List.push(
				<div className={styles.column_item} key={item.id.toString()} 
				id={item.id.toString()} onClick={handleSelect}>
					{item.nickname}
					@
					{g.group}
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
    const [cookies] = useCookies(['token']);

	const handleQuery = async () => {
		const url = "api/people/friends/" + (query == "" ? "*" : query);
		console.log(url);
        try {
            const response = await request(
                url,
                "GET",
                cookies,
            );
			setFriends(response?.friendList);
			console.log(response.friendList);
        } catch(err) {
            console.log(err);
        }
	};
	useEffect(() => { handleQuery(); }, [query]);

	return (
		<div className={styles.column}>
			<div className={styles.column_search}>
				<input className={styles.search_bar}
                    type="text"
					placeholder="🔎"
                    onChange={(e) => { setQuery(e.target.value); }}
                    value={query}
				/>
			</div>
			<FriendList groups={friends} setProfile={props.setProfile}/>
		</div>
	);
};

export default Column;