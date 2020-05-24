const CronJob = require('cron').CronJob;
const axios = require('axios');

const paths = [
  '/',
  '/api/lists/browse',
];
const hosts = ['staging.bechdel-lists.jbrunton.com', 'bechdel-lists.jbrunton.com'];

new CronJob(
	'*/10 * * * * *',
	async function() {
    for (let host of hosts) {
      for (let path of paths) {
        const url = `https://${host}${path}`;
        try {
          const response = await axios.get(url);
          console.log(`Received ${response.status} from ${url}`);
        } catch (e) {
          console.error(`Error pinging ${url}:`);
          console.log(e);
        }
      }
    }
	},
	null,
	true,
	'Europe/London'
);
