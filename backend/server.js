const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // eslint-disable-line no-console
  console.log(`API endpoints available at http://localhost:${PORT}/api`); // eslint-disable-line no-console
});