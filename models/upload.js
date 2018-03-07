const Minio = require('minio')

let https = false
let port = 9000
if (process.env['NODE_ENV'] === 'production') {
  https = true
  port = 443
}

const mc = new Minio.Client({
  endPoint: process.env['S3_URL'] || 'localhost',
  port: port,
  secure: https,
  accessKey: process.env['S3_ACCESS_KEY'] || '1234567890',
  secretKey: process.env['S3_SECRET_KEY'] || '1112131415'
})

const bucket = process.env['S3_BUCKET'] || 'minigram'

class Upload {
  static async getUploadURL (filename) {
    try {
      const url = await mc.presignedPutObject(bucket, filename)
      return {url}
    } catch (e) {
      console.error(e)
    }
  }

  static getURL (filename) {
    return mc.protocol + '//' + mc.host + ':' + mc.port + '/' + bucket + '/' + filename
  }
}

module.exports = Upload
