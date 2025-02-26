import React from 'react';

// 定义组件的属性类型
interface ListItemProps {
    title: string;
    description: string;
    imageUrl: string;
    url: string;
}

const ListItem: React.FC<ListItemProps> = ({ title, description, imageUrl, url }) => {
    const handleItemClick = () => {
        // 使用 window.location.href 跳转到第三方网页
        window.location.href = url;
    };

    return (
        <div className="list-item" onClick={handleItemClick} style={styles.container}>
            <img src={imageUrl} alt={title} style={styles.image} />
            <div style={styles.textContainer}>
                <h2 style={styles.title}>{title}</h2>
                <p style={styles.description}>{description}</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        cursor: 'pointer',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    image: {
        width: '200px',
        height: 'auto'
    },
    textContainer: {
        padding: '10px'
    },
    title: {
        margin: '0 0 10px 0'
    },
    description: {
        margin: '0'
    }
};

export default ListItem;
