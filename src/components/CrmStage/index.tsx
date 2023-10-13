import React from 'react';
//@ts-ignore
import styles from './CrmStage.module.scss';
import { IStage, IDealJoin } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { CrmDeal } from '../CrmDeal';
import {
    changeDealOrder,
    changeStage,
    sortStage,
    updateDeal,
} from '../../redux/reducers/AccountSlice';

interface IStageProps extends IStage {
    setCurrentDeal: React.Dispatch<React.SetStateAction<IDealJoin | null>>;
    setPreviousDeal: React.Dispatch<React.SetStateAction<IDealJoin | null>>;
    currentDeal: IDealJoin | null;
    previousDeal: IDealJoin | null;
}

export const CrmStage: React.FC<IStageProps> = (props) => {
    const dispatch = useAppDispatch();
    const { deals } = useAppSelector((state) => state.accountReducer);

    const [dealCount, setDealCount] = React.useState(0);
    const [targetDeal, setTargetDeal] = React.useState<IDealJoin | null>(null);

    React.useEffect(() => {
        const count = deals.filter((el) => el.stage_id === props.id);
        setDealCount((prev) => count.length);
    }, [deals]);

    React.useEffect(() => {
        console.log('сработал эффект на текущую');
        if (targetDeal && props.currentDeal) {
            console.log(targetDeal);
            const currentStageDeals: IDealJoin[] = deals.filter(
                (deal) => deal.stage_id === targetDeal.stage_id,
            );
            console.log(currentStageDeals);
            const targetDealIndex = currentStageDeals.findIndex(
                (deal) => deal.id === targetDeal.id,
            );
            const previousDeal = currentStageDeals[targetDealIndex - 1];
            console.log('карточка перетаскиваемая', props.currentDeal.deal_order);
            console.log('карточка на которую наводим', targetDeal.deal_order);
            console.log('карточка которая должна быть выше', previousDeal?.deal_order);
            console.log(currentStageDeals.length);

            let newOrder = 0;

            if (!previousDeal && props.currentDeal.deal_order === targetDeal.deal_order) {
                console.log('верхний элемент и та же карточка');
            } else if (!previousDeal) {
                console.log('верхний элемент');
                if (props.currentDeal.deal_order > targetDeal.deal_order) {
                    console.log('просто дропаем');
                    dispatch(sortStage());
                } else {
                    const reverseDeals = deals.slice().reverse();
                    console.log('reverseDeals', reverseDeals);
                    let closestOrder = 0;
                    for (let i = 0; i < reverseDeals.length; i++) {
                        if (reverseDeals[i].deal_order > targetDeal.deal_order) {
                            closestOrder = reverseDeals[i].deal_order;
                            break;
                        }
                    }
                    console.log('наибольшее близкое число', closestOrder);
                    if (closestOrder && closestOrder - targetDeal.deal_order >= 1000) {
                        newOrder = targetDeal.deal_order + 500;
                    } else if (closestOrder && closestOrder - targetDeal.deal_order < 1000) {
                        newOrder = Math.round(
                            targetDeal.deal_order + (closestOrder - targetDeal.deal_order) / 2,
                        );
                        console.log('Если есть чисто больше', newOrder);
                    } else if (closestOrder === 0) {
                        newOrder = targetDeal.deal_order + 500;
                        console.log('Если это максимальное', newOrder);
                    }
                }
            } else if (props.currentDeal.deal_order === targetDeal.deal_order) {
                console.log('та же карточка');
            } else if (
                props.currentDeal.deal_order > targetDeal.deal_order &&
                props.currentDeal.deal_order < previousDeal.deal_order
            ) {
                console.log('просто дропаем');
                dispatch(sortStage());
            } else {
                if (previousDeal.deal_order - targetDeal.deal_order >= 1000) {
                    console.log('разница больше или равно 1000');
                    newOrder = targetDeal.deal_order + 500;
                    const isAlreadyHaveOrder = deals.filter((deal) => deal.deal_order === newOrder);
                    if (isAlreadyHaveOrder) {
                        newOrder = targetDeal.deal_order + 248;
                    }
                } else if (previousDeal.deal_order - targetDeal.deal_order < 1000) {
                    console.log('разница менее 1000');
                    newOrder = Math.round(
                        targetDeal.deal_order +
                            (previousDeal.deal_order - targetDeal.deal_order) / 2,
                    );
                    console.log(previousDeal.deal_order, '-', targetDeal.deal_order, '/', 2);
                }
            }
            if (newOrder) {
                console.log('отправляем на сервер новый order', newOrder);
                const params = { id: props.currentDeal.id, deal_order: newOrder };
                dispatch(updateDeal(params));
                dispatch(changeDealOrder(params));
                dispatch(sortStage());
            }
        }

        //props.setPreviousDeal(prev=>)
    }, [targetDeal]);

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        if (props.currentDeal && props.currentDeal.stage_id !== props.id) {
            const params = { id: props.currentDeal.id, stage_id: props.id };
            dispatch(updateDeal(params));
            dispatch(changeStage(params));
        }
    };
    const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <div
                onDrop={(e) => {
                    dropHandler(e);
                }}
                onDragOver={(e) => {
                    dragEnterHandler(e);
                }}
                className={styles.stageHolder}
            >
                <div className={styles.header} style={{ background: `${props.color}` }}></div>
                <div className={styles.titleAndCount}>
                    <div className={styles.title}>{props.title}</div>
                    <div className={styles.count}>{dealCount}</div>
                </div>
                <div className={styles.cardSpace}>
                    {deals
                        ?.filter((el) => el.stage_id === props.id)
                        .map((deal, index) => (
                            //@ts-ignore
                            <CrmDeal
                                key={index}
                                {...deal}
                                setTargetDeal={setTargetDeal}
                                setCurrentDeal={props.setCurrentDeal}
                            />
                        ))}
                </div>
            </div>
        </>
    );
};
