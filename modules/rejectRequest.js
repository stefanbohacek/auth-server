const responseCodes = {
  '422': 'Unprocessable Entity'
}

export default (req, res, code) => {
  res.send(code, responseCodes[code.toString()]);
};