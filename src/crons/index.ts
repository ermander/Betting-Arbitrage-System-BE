import schedule from 'node-schedule';

// Functions to run
import fetchBetBurger from './fetchBetburgerArbs';

const jobs: any = [];

// Schedule jobs

// Fetch Betburger arbs every 30 minutes
const fetchBetBurgerJob: any = schedule.scheduleJob(
    '*/30 * * * *',
    fetchBetBurger,
);

jobs.push(fetchBetBurgerJob);

// Start jobs
const startCrons = (): void => {
    console.log('Starting crons...');
    jobs.forEach((job: any) => {
        job.invoke();
    });
};

// Export startCrons function
export default startCrons;
