const getTestMessage = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is up and running',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getTestMessage,
};
