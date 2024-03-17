import cron from 'node-cron';
import axios from 'axios';
import moment from 'moment-timezone';

const urlHourly = 'https://flask-production-d5a3.up.railway.app/authorize';
const urlDaily = 'https://flask-production-d5a3.up.railway.app';
const urlZapier = 'https://hooks.zapier.com/hooks/catch/15640277/3fgumh1/';

// Set the desired time zone
const desiredTimeZone = 'America/New_York';

// Convert the current date and time to the desired time zone
const currentDateTime = moment().tz(desiredTimeZone);

// Set the desired time of 10 am in the desired time zone
const desiredTime = currentDateTime.clone().set({ hour: 12, minute: 0, second: 0 });

// Schedule cron job to run every 45 minutes
cron.schedule('*/45 * * * *', () => {
  axios.get(urlHourly)
    .then((response) => {
      const responseData = response.data;
      console.log(`Hourly URL ${urlHourly} executed successfully. Response: `, responseData);
    })
    .catch((error) => {
      console.error(`An error occurred while executing Hourly URL ${urlHourly}: ${error}`);
    });
});

// Schedule cron job to run at the desired time in the desired time zone
cron.schedule(desiredTime.format('m H * * *'), () => {
  axios.get(urlDaily)
    .then((response) => {
      const responseData = response.data;
      console.log(`Daily URL ${urlDaily} executed successfully. Response: `, responseData);
    })
    .catch((error) => {
      console.error(`An error occurred while executing Daily URL ${urlDaily}: ${error}`);
    });
});
// Additional cron job to trigger a job every hour for 8x8
cron.schedule('0 * * * *', () => {
  axios.get('https://nodejs-production-d518.up.railway.app/trigger-job')
    .then((response) => {
      const responseData = response.data;
      console.log(`Hourly Trigger URL executed successfully. Response: `, responseData);
    })
    .catch((error) => {
      console.error(`An error occurred while executing Hourly Trigger URL: ${error}`);
    });
});

// Schedule cron job to run daily at 12:00 AM and send a POST request to Zapier URL
cron.schedule('0 0 * * *', () => {
  axios.post(urlZapier, { message: 'Daily job executed' })
    .then((response) => {
      console.log(`Daily job executed successfully. Response: `, response.data);
    })
    .catch((error) => {
      console.error(`An error occurred while executing the daily job: ${error}`);
    });
});
