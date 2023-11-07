import schedule from 'node-schedule';

// Functions to run
import fetchBetBurger from './fetchBetburgerArbs';
import fetchEPlayOdds from './fetchEPlayOdds';

const jobs: any = [];

// Schedule jobs

// Fetch Betburger arbs every 30 minutes
const fetchBetBurgerJob: any = schedule.scheduleJob(
    '*/30 * * * *',
    fetchBetBurger,
);
jobs.push(fetchBetBurgerJob);

// Fetch EPlayOdds matches every 5 minutes
const fetchEPlayOddsJob: any = schedule.scheduleJob(
    '*/5 * * * *',
    fetchEPlayOdds,
);
jobs.push(fetchEPlayOddsJob);

// Start jobs
const startCrons = (): void => {
    console.log('Starting crons...');
    jobs.forEach((job: any) => {
        job.invoke();
    });
};

// Export startCrons function
export default startCrons;
