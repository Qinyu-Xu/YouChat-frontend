import styles from '@/styles/layout.module.css'

function Column() {
	return (
		<div className={styles.column}>
			<div className={styles.column_search}>
					<input className={styles.search_bar}>
					</input>
			</div>
			<div className={styles.column_item}>
				item 1
			</div>
			<div className={styles.column_item}>
				item 2
			</div>
			<div className={styles.column_item}>
				item 3
			</div>
			<div className={styles.column_item}>
				item 3
			</div>
			<div className={styles.column_item}>
				item 3
			</div>
			<div className={styles.column_item}>
				item 3
			</div>
			<div className={styles.column_item}>
				item 3
			</div>	
		</div>
	);
};

export default Column;