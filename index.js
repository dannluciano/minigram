const nunjucks = require('nunjucks')
const server = require('server')

const Usuario = require('./models/usuario')
const Publicacao = require('./models/publicacao')
const Upload = require('./models/upload.js')

const {get, post, error} = server.router
const {render, status, redirect} = server.reply

const logger = ctx => {
  ctx.log.info(`Pid ${process.pid} - ${ctx.method} ${ctx.url}`)
}

const indexHandler = ctx => {
  return render('base.njk', {title: 'Minigram'})
}

const usuarioCadastarForm = ctx => {
  return render('usuario_novo.njk')
}

const usuarioCadastar = async ctx => {
  const novoUsuario = new Usuario(ctx.data)
  if (novoUsuario.isValid() && await novoUsuario.save()) {
    return redirect('/entrar')
  }
  return render('usuario_novo.njk', {usuario: novoUsuario})
}

const publicarForm = ctx => {
  return render('publicar.njk')
}

const publicar = async ctx => {
  const usuarioLogado = 1
  const imageURL = Upload.getURL(ctx.data.foto)
  const novaPublicacao = new Publicacao(ctx.data, imageURL, usuarioLogado)
  if (await novaPublicacao.save()) {
    return redirect('/')
  } else {
    return render('publicar.njk', {publicacao: novaPublicacao})
  }
}

const paginaPublicacoes = async ctx => {
  const publicacoes = await Publicacao.getAll()
  return render('publicacoes.njk', {publicacoes: publicacoes})
}

const paginaPublicacao = async ctx => {
  const id = ctx.params.id
  const publicacao = await Publicacao.get(id)
  return render('publicacao.njk', {publicacao: publicacao})
}

const getUploadURL = async ctx => {
  return Upload.getUploadURL(ctx.query.filename)
}

const opcoes = {
  engine: 'nunjucks'
}

const rotas = [
  [logger],
  get('/perfil/', indexHandler),
  get('/perfil/:usuario', indexHandler),
  get('/pesquisar', indexHandler),
  get('/publicacoes/:id', paginaPublicacao),
  get('/upload-url', getUploadURL),
  error(ctx => {
    console.error(ctx.error.message)
    return status(500).send(ctx.error.message)
  })
]

const init = async () => {
  const servidor = await server(opcoes, rotas)
  nunjucks.configure('templates', {express: servidor.app})
}
init()
