const db = require('../db')

const Minio = require('minio')

const minioClient = new Minio.Client({
  endPoint: 'static.dannluciano.com.br',
  secure: true,
  accessKey: 'T1194WMPGIWYY0FKWRT4',
  secretKey: '1Ton4PMstShWUFnXsu4ZbNZZmS44ZK6bctdhhZS4'
})

// var minioClient = new Minio.Client({
//   endPoint: 'play.minio.io',
//   port: 9000,
//   secure: true,
//   accessKey: 'Q3AM3UQ867SPQQA43P2F',
//   secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
// })

const bucket = 'minigram'

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

  async save () {
    try {
      await minioClient.fPutObject(bucket, this.foto.name, this.foto.path, this.foto.type)
      this.path = 'https://static.dannluciano.com.br/' + bucket + '/' + this.foto.name
      console.log('Arquivo enviado com Sucesso: ', this.path)

      await db.none(`INSERT INTO publicacoes (localizacao, foto, legenda, filtro, dono) 
          VALUES ($[localizacao], $[path], $[legenda], $[filtro], $[dono] )`, this)
      console.info('Publicação criada com Sucesso')
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

module.exports = Publicacao
