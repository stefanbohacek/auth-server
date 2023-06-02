const responseCodes = {
  '422': 'Unprocessable Entity'
}

const rejectRequest = (req, res, code) => {
  res.send(code, responseCodes[code.toString()]);
};

export default rejectRequest;
