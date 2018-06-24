const db = require('../db')

class Autenticacao {
  static async autenticar (nome, senha, sessao) {
    try {
      const usuario = await db.any(`SELECT * FROM usuarios WHERE nome = $1 AND senha = $2`, [nome, senha])
      if (usuario.length === 1) {
        console.info('Usuario autenticado com sucesso')
        sessao.autenticado = true
        sessao.userId = usuario[0].id
        sessao.usuario = usuario[0].nome
        sessao.email = usuario[0].email
        return true
      } else {
        console.error('Falha na autenticação do usuario')
        return false
      }
    } catch (e) {
      console.error(e)
      return false
    }
  }

  static finalizar (sessao) {
    sessao.destroy()
    console.info('Usuario des-autenticado com sucesso')
  }
}

module.exports = Autenticacao
