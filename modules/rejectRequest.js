const responseCodes = {
  "422": "Unprocessable Entity",
};

export default (req, res, code) => {
  res.status(code).send(responseCodes[code.toString()]);
};
