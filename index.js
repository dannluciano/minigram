const nunjucks = require('nunjucks')
const server = require('server')

const Usuario = require('./models/usuario')

const {get, post, error} = server.router
const {render, status, redirect} = server.reply

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

const opcoes = {}

const rotas = [
  get('/', indexHandler),
  get('/entrar', indexHandler),
  post('/entrar', indexHandler),
  post('/sair', indexHandler),
  get('/cadastrar', usuarioCadastarForm),
  post('/cadastrar', usuarioCadastar),
  get('/perfil/', indexHandler),
  get('/perfil/:usuario', indexHandler),
  get('/pesquisar', indexHandler),
  get('/publicar', indexHandler),
  post('/publicar', indexHandler),
  get('/publicacoes/:id', indexHandler),
  post('/publicacoes/:id/comentar', indexHandler),
  error(ctx => status(500).send(ctx.error.message))
]

const init = async () => {
  const servidor = await server(opcoes, rotas)
  nunjucks.configure('templates', {express: servidor.app})
}
init()
