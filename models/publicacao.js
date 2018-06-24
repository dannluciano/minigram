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
      return await db.any(`
        SELECT publicacoes.id as publicacao_id, localizacao, foto, legenda, filtro, usuarios.id as usuario_id, nome
        FROM publicacoes JOIN usuarios ON (publicacoes.dono=usuarios.id) 
        ORDER BY publicacoes.id DESC`)
    } catch (e) {
      console.error(e)
    }
  }

  static async getAllFromUser (userId) {
    try {
      return await db.any(`
        SELECT publicacoes.id as publicacao_id, localizacao, foto, legenda, filtro, usuarios.id as usuario_id, nome
        FROM publicacoes JOIN usuarios ON (publicacoes.dono=usuarios.id) 
        WHERE dono = $1 ORDER BY publicacoes.id DESC`, [userId])
    } catch (e) {
      console.error(e)
    }
  }

  static async getAllFeedFromUser (userId) {
    try {
      return await db.any(`
        SELECT publicacoes.id as publicacao_id, localizacao, foto, legenda, filtro, usuarios.id as usuario_id, nome 
        FROM publicacoes JOIN usuarios ON (publicacoes.dono=usuarios.id) WHERE 
        dono = $1 OR 
        dono IN (SELECT seguindo FROM seguidores WHERE seguidor = $2) 
        ORDER BY publicacoes.id DESC`, [userId, userId])
    } catch (e) {
      console.error(e)
    }
  }

  static async get (id) {
    try {
      return await db.one(`
        SELECT publicacoes.id as publicacao_id, localizacao, foto, legenda, filtro, usuarios.id as usuario_id, nome 
        FROM publicacoes JOIN usuarios ON (publicacoes.dono=usuarios.id)
        WHERE publicacoes.id = $1`, id)
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
