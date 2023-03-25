import { useState } from 'react';
import { request } from "@/utils/network";
import styles from '@/styles/layout.module.css'

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
}

const FriendList = (props: FriendListProps) => {
	const List: any[] = [];
	props.groups?.map(g => {
		g.list.map(item => {
			List.push(
				<div className={styles.column_item}>
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

function Column() {
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
			<FriendList groups={friends}/>
		</div>
	);
};

export default Column;