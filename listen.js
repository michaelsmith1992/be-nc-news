const { PORT = 3000 } = process.env;
const app = require('./app');

app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
});
