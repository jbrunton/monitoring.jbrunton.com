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

new CronJob('*/10 * * * * *', ping, null, true, 'Europe/London');

if (process.env['LOAD_TEST'] == 1) {
  new CronJob('*/1 0 * * * *', loadTest, null, true, 'Europe/London');
}

async function ping() {
  console.log('Starting ping');
  const paths = [
    '/',
    '/api/lists/browse',
  ];
  for (let [envName, env] of Object.entries(environments)) {
    const host = env.host;
    for (let path of paths) {
      const url = `https://${host}${path}`;
      loadUrl(url);
    }
  }
}

async function loadTest() {
  console.log('Starting load test');
  const iterations = {
    'bechdel-lists.jbrunton.com': 10,
    'staging.bechdel-lists.jbrunton.com': 2
  };
  for (let [envName, env] of Object.entries(environments)) {
    const host = env.host;
    const lists = (await axios.get(`https://${host}/api/lists/browse`)).data;
    const list = lists.find(list => list.title.includes('Global Top 10 Movies'));
    if (list) {
      const paths = [
        '/api/lists/browse',
        `/api/lists/${list.id}`,
        `/api/lists/${list.id}/charts/by_year`,
      ];
      for (let path of paths) {
        const url = `https://${host}${path}`;
        for (let i = 0; i < iterations[host]; ++i) {
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
