class Transaction {
  constructor(gameuser, cryptoId, cryptoAmmount, cryptoValue) {
    this.gameuser = gameuser;
    this.cryptoId = cryptoId;
    this.cryptoAmmount = cryptoAmmount;
    this.cryptoValue = cryptoValue;
  }

  calculateTransactionValue() {
    return this.cryptoAmmount*this.cryptoValue;
  }

}

module.exports = Transaction;