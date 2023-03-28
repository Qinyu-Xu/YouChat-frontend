import { useState } from 'react';
import { request } from "@/utils/network";
import styles from '@/styles/layout.module.css'
import profile_type from '@/pages/friend'
import { setPriority } from 'os';

interface User {
	id: number,
	nickname: string,
};

interface Group {
	group: string,
	list: Array<User>,
};

interface FriendListProps {
	groups?: Array<Group>,
	setProfile?: any;
}

const FriendList = (props: FriendListProps) => {
	const List: any[] = [];

	const handleSelect = async (e: any) => {
		console.log(e);
        try {
            const response = await request(
                "/people/profile" + e.target.id,
                "GET",
				"",
            );
			props.setProfile(response?.data);
        } catch(err) {
            console.log(err);
        }
	};

	props.groups?.map(g => {
		g.list.map(item => {
			List.push(
				<div className={styles.column_item} id={item.id.toString()} onClick={handleSelect}>
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

	const handleQuery = async () => {
        try {
            const response = await request(
                "/people/friends",
                "GET",
                JSON.stringify({query}),
            );
			setFriends(response?.data?.friendList);
        } catch(err) {
            console.log(err);
        }
	};

	handleQuery();

	return (
		<div className={styles.column}>
			<div className={styles.column_search}>
				<input className={styles.search_bar}
                    type="text"
                    onChange={(e) => {
						setQuery(e.target.value);
						handleQuery();
					}}
                    value={query}
				/>
			</div>
			<FriendList groups={friends} setProfile={props.setProfile}/>
		</div>
	);
};

export default Column;