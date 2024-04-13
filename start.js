// run npm run dev and start chrome

const { exec } = require('child_process');

exec('npm run dev', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

const obj = {
  dashboard: '3000',
  coepresult: '3001',
  'lecture-lab-feedback': '3002',
  lms: '3003',
  'venue-frontend': '3004',
  chatbot: '3005',
};

let locations = '';

Object.entries(obj).forEach(([key, value]) => {
  locations += `http://localhost:${value} `;
});

exec(`start chrome ${locations}`);
