module.exports = function forbiddenError(messsage = 'Não tem acesso ao recurso solicitado') {
  this.name = 'forbiddenError';
  this.message = messsage;
};
