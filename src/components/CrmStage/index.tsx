import React from 'react';
//@ts-ignore
import styles from './CrmStage.module.scss';
import { IStage, IDealJoin } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { CrmDeal } from '../CrmDeal';
import {
    changeDealPosition,
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
            const nextDeal = currentStageDeals[targetDealIndex + 1];
            console.log('карточка перетаскиваемая', props.currentDeal.deal_position);
            console.log('карточка на которую наводим', targetDeal.deal_position);
            console.log('карточка которая должна быть выше', previousDeal?.deal_position);
            console.log('карточка которая должна быть ниже', previousDeal?.deal_position);
            console.log(currentStageDeals.length);

            let newPosition = 0;

            //Если та же карточка
            if (props.currentDeal.id === targetDeal.id) {
                console.log('та же карточка, ничего не делаем');
            }
            //Нет карточки сверху
            else if (!previousDeal) {
                console.log('верхний элемент');

                if (props.currentDeal.deal_position > targetDeal.deal_position) {
                    console.log('просто дропаем и обновляем');
                    dispatch(sortStage());
                } else {
                    newPosition = targetDeal.deal_position + 32_766;
                }
            }
            //Нет карточки снизу
            else if (!nextDeal) {
                console.log('нижний элемент');

                if (props.currentDeal.deal_position < targetDeal.deal_position) {
                    console.log('просто дропаем и обновляем');
                    dispatch(sortStage());
                } else {
                    newPosition = targetDeal.deal_position - 32_766;
                }
            }
            //Значение можно не менять
            else if (
                props.currentDeal.deal_position > targetDeal.deal_position &&
                props.currentDeal.deal_position < previousDeal.deal_position
            ) {
                console.log('просто дропаем и обновляем');
                dispatch(sortStage());
            }
            //Карточка перемещается с верхней позиции
            else if (props.currentDeal.deal_position > targetDeal.deal_position) {
                newPosition =
                    nextDeal.deal_position +
                    (targetDeal.deal_position - nextDeal.deal_position) / 2;
            }
            //Карточка перемещается с нижней позиции
            else {
                newPosition = Math.round(
                    targetDeal.deal_position +
                        (previousDeal.deal_position - targetDeal.deal_position) / 2,
                );
            }
            if (newPosition) {
                console.log('отправляем на сервер новый Position', newPosition);
                const params = { id: props.currentDeal.id, deal_position: newPosition };
                dispatch(updateDeal(params));
                dispatch(changeDealPosition(params));
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
                <div className={styles.header} style={{ background: `${props.stage_color}` }}></div>
                <div className={styles.titleAndCount}>
                    <div className={styles.title}>{props.stage_title}</div>
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
