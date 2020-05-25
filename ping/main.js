const CronJob = require('cron').CronJob;
const axios = require('axios');

const environments = {
  staging: {
    host: 'staging.bechdel-lists.jbrunton.com'
  },
  production: {
    host: 'bechdel-lists.jbrunton.com'
  }
};

const jobs = {
  ping: {
    iterations: 1  
  },
  load: {
    description: 'load test',
    iterations: {
      staging: 2,
      production: 10
    }
  }
}

new CronJob('*/10 * * * * *', () => runTest('ping'), null, true, 'Europe/London');

if (process.env['LOAD_TEST'] == 1) {
  new CronJob('*/1 1 * * * *', () => runTest('load'), null, true, 'Europe/London');
} else {
  console.log('LOAD_TEST not set, skipping load tests');
}

async function runTest(jobName) {
  const config = jobs[jobName];
  const description = config.description || jobName;
  console.log(`Starting ${description}`);

  for (let [envName, env] of Object.entries(environments)) {
    const host = env.host;
    const lists = (await axios.get(`https://${host}/api/lists/browse`)).data;
    const list = lists.find(list => list.title.includes('Global Top 10 Movies'));
    if (list) {
      const paths = [
        '/',
        '/api/lists/browse',
        `/api/lists/${list.id}`,
        `/api/lists/${list.id}/charts/by_year`,
      ];
      for (let path of paths) {
        const url = `https://${host}${path}`;
        const iterations = (typeof config.iterations == 'object') ? config.iterations[envName] : config.iterations;
        for (let i = 0; i < iterations; ++i) {
          loadUrl(url);
        }
      }
    } else {
      console.error('Could not find Global Top 10 Movies list, aborting test');
    }
  }
}

async function loadUrl(url) {
  try {
    const response = await axios.get(url);
    console.log(`Received ${response.status} from ${url}`);
  } catch (e) {
    console.error(`Error pinging ${url}:`);
    console.log(e);
  }
}
