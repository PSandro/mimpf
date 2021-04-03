const dcrf = require('dcrf-client');
const client = dcrf.connect('ws://127.0.0.1')

client.retrieve('appointment', 1).then(appointment => {
  console.info('Retrieved appointment 1:', appointment);
});
