// /api/status
// método send não define o charset mas o json sim
function status(request, response) {
  response.status(200).json({ Chave: "Valor" });
}

export default status;
