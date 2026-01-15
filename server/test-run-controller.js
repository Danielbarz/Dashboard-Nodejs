import { getHSIDashboard } from './src/controllers/dashboardController.js';
import { PrismaClient } from '@prisma/client';

// Mock request, response, and next objects
const req = {
  query: {
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    global_witel: 'JATIM TIMUR',
    map_status: 'Completed,Open'
  }
};

const res = {
  status: (code) => ({
    json: (data) => console.log('Response Status:', code, 'Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...')
  }),
  setHeader: (key, value) => console.log('Header set:', key, value),
  send: (data) => console.log('Response Sent (Buffer/Data)')
};

const next = (error) => {
  console.error('Next called with error:', error);
};

async function test() {
  console.log('Testing getHSIDashboard...');
  await getHSIDashboard(req, res, next);
}

test();
