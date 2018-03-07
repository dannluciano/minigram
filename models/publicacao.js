const db = require('../db')

class Publicacao {
  constructor (pub, foto, dono) {
    this.localizacao = pub.localizacao
    this.foto = foto
    this.legenda = pub.legenda
    this.filtro = pub.filtro
    this.dono = dono
    this.erros = []
  }

  isValid () {
    return this.erros.length === 0
  }

  static async getAll () {
    try {
      return await db.any('SELECT * FROM publicacoes ORDER BY id DESC LIMIT 20')
    } catch (e) {
      console.error(e)
    }
  }

  static async get (id) {
    try {
      return await db.one('SELECT * FROM publicacoes WHERE id = $1', id)
    } catch (e) {
      console.error(e)
    }
  }

  async save () {
    try {
      await db.none(`INSERT INTO publicacoes (localizacao, foto, legenda, filtro, dono) 
          VALUES ($[localizacao], $[foto], $[legenda], $[filtro], $[dono] )`, this)
      console.info('Publicação criada com Sucesso')
      return true
    } catch (e) {
      console.error(e)
      this.erros.push({'msg': 'Falha no Envio da Imagem! Verifique sua Internet e tente novamente.'})
      return false
    }
  }
}

module.exports = Publicacao
