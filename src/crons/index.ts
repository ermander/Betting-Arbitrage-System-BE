import schedule from 'node-schedule';

// Functions to run
import fetchBetBurger from './fetchBetburgerArbs';

// RobinOdds
import fetchRobinOdds from './fetchRobinOdds';

// Bookmakers
import fetchSisal from './sisal';
import fetchEPlayOdds from './fetchEPlayOdds';

const jobs: any = [];

// Schedule jobs
// Fetch RobinOdds arbs every 15 minutes from 10:00 to 23:00
const fetchRobinOddsJob: any = schedule.scheduleJob(
    '0,15,30,45 10-23 * * *',
    fetchRobinOdds,
);

jobs.push(fetchRobinOddsJob);

// // Fetch Betburger arbs every 30 minutes
// const fetchBetBurgerJob: any = schedule.scheduleJob(
//     '*/30 * * * *',
//     fetchBetBurger,
// );
// jobs.push(fetchBetBurgerJob);

// // Fetch EPlayOdds matches every 5 minutes
// const fetchEPlayOddsJob: any = schedule.scheduleJob(
//     '*/5 * * * *',
//     fetchEPlayOdds,
// );
// jobs.push(fetchEPlayOddsJob);

// Fetch Sisal matches every 30 minutes (from 8:00 to 23:00)
const fetchSisalJob: any = schedule.scheduleJob('0,30 8-23 * * *', fetchSisal);
jobs.push(fetchSisalJob);

// Start jobs
const startCrons = (): void => {
    console.log('Starting crons...');
    jobs.forEach((job: any) => {
        job.invoke();
    });
};

// Export startCrons function
export default startCrons;
