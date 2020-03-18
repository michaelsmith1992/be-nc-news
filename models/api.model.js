const fs = require('fs').promises;

async function readEndPoints() {
  const endPoints = await fs.readFile('./endpoints.json', 'utf8');
  return JSON.parse(endPoints);
}

module.exports = {
  readEndPoints
};
