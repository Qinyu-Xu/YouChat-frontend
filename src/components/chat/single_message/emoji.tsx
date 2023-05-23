import styles from "@/styles/chat.module.css";

const emoji_list = [
    '😀', '😂', '🤣', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘',
    '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😶', '🙄', '😏', '😣', '😥', '🤐',
    '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔',
    '🙃', '😲', '🙁', '😖', '😟', '😤', '😢', '😭', '😧', '😨', '🤯', '😬',
    '😰', '😱', '😳', '🤪', '😵', '😡', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '😇', '🤡', '🤫', '🤭', '🧐', '🤓', '👻', '🤖', '💩', '🙌', '👏', '🤝',
    '👍', '👎', '👊', '🤟', '👌', '👈', '👉', '👆', '👇', '👋', '💪', '🙏'
];

const EmojiBoard = (props: any) => {
    const handleEmoji = (e: any) => {
        props.setText(props.text + e.target.id);
    };

    const emojiList: any[] = [];
    emoji_list.forEach((emoji, index) => {
        emojiList.push(
            <button className={styles.emoji_item} id={emoji} onClick={handleEmoji} key={index}>
                {emoji}
            </button>
        );
    });

    return (
        <div className={styles.emoji_board}>
            { emojiList }
        </div>
    );

}

export const EmojiIcon = (props: any) => {
    return (
    <div className={styles.function_button} onClick={() => {
        props.setEmoji(!props.emoji);
    }}>
        <img src="ui/emoji.svg"/>
    </div>
    )
}

export default EmojiBoard;