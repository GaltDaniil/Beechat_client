import React from 'react';
//@ts-ignore
import styles from './CrmDeal.module.scss';
import { IDealJoin } from '../../types';
import { DollarOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';

export const CrmDeal: React.FC<IDealJoin> = (props) => {
    const [isDragEnter, setIsDragEnter] = React.useState(false);

    const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
        props.setCurrentDeal((prev) => props);
        //@ts-ignore
        e.target.style.opacity = '0.4';
    };

    const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
        //@ts-ignore
        e.target.style.opacity = '1';
    };

    const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragEnter((prev) => true);
    };
    const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('leave');
        if (e.target === e.currentTarget) {
            setIsDragEnter(false);
        }
    };
    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        props.setTargetDeal((prev) => props);
        setIsDragEnter(false);
    };
    console.log(isDragEnter);

    return (
        <div
            draggable={true}
            onDragStart={(e) => {
                dragStartHandler(e);
            }}
            onDragEnd={(e) => {
                dragEndHandler(e);
            }}
            onDrop={(e) => {
                dropHandler(e);
            }}
            onDragEnter={(e) => dragEnterHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            className={!isDragEnter ? styles.container : `${styles.container} ${styles.dragEnter}`}
        >
            <div className={styles.infoHolder}>
                <div className={styles.infoLine}>
                    <ShoppingOutlined />
                    <p>{props.deal_title}</p>
                </div>
                <div className={styles.infoLine}>
                    <UserOutlined />
                    <div className={styles.clientHolder}>
                        <div className={styles.avatarHolder}>
                            {props.client_avatar ? (
                                <img
                                    src={`https://beechat.ru${props.client_avatar}`}
                                    alt="avatar"
                                />
                            ) : (
                                <img
                                    src="https://shapka-youtube.ru/wp-content/uploads/2021/02/prikolnaya-avatarka-dlya-patsanov.jpg"
                                    alt="avatar"
                                />
                            )}
                        </div>
                        <p>
                            {props.client_surname
                                ? props.client_name + ' ' + props.client_surname
                                : props.client_name}
                        </p>
                    </div>
                </div>
                <div className={styles.infoLine}>
                    <DollarOutlined />
                    <p>{props.deal_price ? props.deal_price : ''}</p>
                </div>
            </div>
            <div className={styles.imgHolder}></div>
        </div>
    );
};
