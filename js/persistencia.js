const Persistencia = {
  adiciona: function (chave, objeto) {
    let vetor = [];
    if (this.existe(chave)) {
      vetor = this.carrega(chave);
    }
    vetor.push(objeto);
    this.salva(chave, vetor);
  },
  salva: function (chave, objeto) {
    localStorage[chave] = JSON.stringify(objeto);
  },
  carrega: function (chave) {
    if (this.existe(chave)) {
      return JSON.parse(localStorage[chave]);
    } else {
      return null;
    }
  },
  existe: function (chave) {
    return localStorage[chave] ? true : false;
  }
};
