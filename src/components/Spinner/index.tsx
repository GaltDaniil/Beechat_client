//@ts-ignore
import styles from './Spinner.module.scss';
import React from 'react';

export const Spinner = () => {
    return (
        <div className={styles.container}>
            <div className={styles.loader}></div>;
        </div>
    );
};
