const Minio = require('minio')

const production = process.env['NODE_ENV'] === 'production'

var minioClient = new Minio.Client({
  endPoint: process.env['S3_URL'] || 'localhost',
  secure: production,
  accessKey: process.env['ACCESS_KEY'] || '',
  secretKey: process.env['SECRET_KEY'] || ''
})

const bucket = process.env['BUCKET'] || 'minigram'

module.exports = {
  upload: async (file) => {
    try {
      await minioClient.fPutObject(bucket, file.filename, file, 'image/*')
      console.log('File uploaded successfully.')
    } catch (erro) {
      console.error(erro.message)
    }
  }
}
