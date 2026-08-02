import https from 'https';
https.get('https://carecalculus.com', (res) => {
  console.log(JSON.stringify(res.headers, null, 2));
}).on('error', (e) => {
  console.error(e);
});
