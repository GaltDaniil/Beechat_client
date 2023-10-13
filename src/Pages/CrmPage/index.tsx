import React from 'react';
//@ts-ignore
import styles from './CrmPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getDeals, getPipelines, getStages } from '../../redux/reducers/AccountSlice';
import { CrmStage } from '../../components/CrmStage';
import { IDealJoin } from '../../types';

export const CrmPage = () => {
    const dispatch = useAppDispatch();

    const { stages, pipelines } = useAppSelector((state) => state.accountReducer);
    const [currentDeal, setCurrentDeal] = React.useState<IDealJoin | null>(null);
    const [previousDeal, setPreviousDeal] = React.useState<IDealJoin | null>(null);

    React.useEffect(() => {
        console.log('запущена разовая');
        const getPipelinesFx = async () => {
            await dispatch(getPipelines(1));
        };
        getPipelinesFx();
    }, []);

    React.useEffect(() => {
        console.log('запущен эффект с pipeline');
        const pipeline_ids = pipelines.map((el) => el.id);
        const getStagesFx = async () => {
            await dispatch(getStages({ pipeline_ids: pipeline_ids }));
        };
        getStagesFx();
    }, [pipelines]);
    React.useEffect(() => {
        console.log('запущен эффект с stages');
        const stage_ids = stages.map((el) => el.id);
        const getStagesFx = async () => {
            await dispatch(getDeals({ stage_ids: stage_ids }));
        };
        getStagesFx();
    }, [stages]);

    return (
        <div className={styles.content}>
            {stages?.map((stage, index) => (
                <CrmStage
                    key={index}
                    {...stage}
                    setCurrentDeal={setCurrentDeal}
                    setPreviousDeal={setPreviousDeal}
                    currentDeal={currentDeal}
                    previousDeal={previousDeal}
                />
            ))}
        </div>
    );
};
