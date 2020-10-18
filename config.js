const { PORT = 3000, DATABASE = 'news-explorer_debug', JWT_SECRET = 'Eyjafjallajökull' } = process.env;

module.exports = {
  PORT,
  DATABASE,
  JWT_SECRET,
};
