import fs from 'fs-extra';
import axios from 'axios';
const cwd = process.cwd();
const c = fs.readJSONSync(`${cwd}/config.json`);
const { site } = c.siteConfig;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkSite = async () => {
  try {
    const response = await axios.get(site);
    if (!response) {
      sleep(200);
      console.log('[-]: Site is down.');
      sleep(1500);
      process.exit();
    } else {
      sleep(200);
      console.log('[+]: Site up!, starting attack process.');
    }
  } catch (error) {
    console.error(`[-]: An error occurred while checking site: ${error}`);
  }
};

export default { sleep, checkSite };