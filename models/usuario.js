const db = require('../db')

class Usuario {
  constructor (usuario) {
    this.nome = usuario.nome
    this.email = usuario.email
    this.senha = usuario.senha
    this.erros = []
  }

  static async getUserIdFromName (nome) {
    try {
      const usuarios = await db.any('SELECT * FROM usuarios WHERE nome = $1 LIMIT 1', [nome])
      if (usuarios.length === 1) {
        return usuarios[0].id
      }
    } catch (e) {
      console.error(e)
    }
  }

  isValid () {
    if (this.nome === '') {
      this.erros.push({'msg': 'Nome não pode ser vazio'})
    }

    if (this.email === '') {
      this.erros.push({'msg': 'E-mail não pode ser vazio'})
    }

    if (!this.email.includes('@')) {
      this.erros.push({'msg': 'E-mail não é valido'})
    }

    if (this.senha === '') {
      this.erros.push({'msg': 'Senha não pode ser vazio'})
    }

    if (this.senha.length < 6) {
      this.erros.push({'msg': 'Senha teve conter mais de seis caracteres'})
    }

    return this.erros.length === 0
  }

  async save () {
    try {
      await db.none(`INSERT INTO usuarios (nome, email, senha) 
          VALUES ($[nome], $[email], $[senha])`, this)
      console.info('Usuario criado com Sucesso')
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

module.exports = Usuario
