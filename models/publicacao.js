const db = require('../db')

const Minio = require('minio')

let https = false
let port = 9000
if (process.env['NODE_ENV'] === 'production') {
  https = true
  port = 443
}

const minioClient = new Minio.Client({
  endPoint: process.env['S3_URL'] || 'localhost',
  port: port,
  secure: https,
  accessKey: process.env['S3_ACCESS_KEY'] || '1234567890',
  secretKey: process.env['S3_SECRET_KEY'] || '1112131415'
})

const bucket = process.env['S3_BUCKET'] || 'minigram'

class Publicacao {
  constructor (pub, foto, dono) {
    this.localizacao = pub.localizacao
    this.foto = foto
    this.path = ''
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
      await minioClient.fPutObject(bucket, this.foto.name, this.foto.path, this.foto.type)
      this.path = minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + bucket + '/' + this.foto.name
      console.log('Arquivo enviado com Sucesso: ', this.path)

      await db.none(`INSERT INTO publicacoes (localizacao, foto, legenda, filtro, dono) 
          VALUES ($[localizacao], $[path], $[legenda], $[filtro], $[dono] )`, this)
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
