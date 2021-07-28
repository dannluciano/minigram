const nunjucks = require('nunjucks')
const server = require('server')

const Usuario = require('./models/usuario')
const Publicacao = require('./models/publicacao')
const Autenticacao = require('./models/autenticacao')
const Upload = require('./models/upload.js')

const { get, post, error } = server.router
const { render, status, redirect } = server.reply

const logger = ctx => {
  ctx.log.info(`Pid ${process.pid} - ${ctx.method} ${ctx.url}`)
}

const locals = ctx => {
  ctx.locals.usuario = ctx.session.usuario || 'anonymous'
  ctx.locals.email = ctx.session.email || 'anonymous@anonymous'
  ctx.locals.autenticado = ctx.session.autenticado || false
  ctx.log.info(ctx.session.autenticado || false)
}

const indexHandler = ctx => {
  return render('base.njk', { title: 'Minigram' })
}

const usuarioCadastarForm = ctx => {
  return render('usuario_novo.njk')
}

const usuarioCadastar = async ctx => {
  const novoUsuario = new Usuario(ctx.data)
  if (novoUsuario.isValid() && await novoUsuario.save()) {
    return redirect('/entrar')
  }
  return render('usuario_novo.njk', { usuario: novoUsuario })
}

const publicarForm = ctx => {
  return render('publicar.njk')
}

const publicar = async ctx => {
  const usuarioLogado = ctx.session.userId
  const imageURL = Upload.getURL(ctx.data.foto)
  const novaPublicacao = new Publicacao(ctx.data, imageURL, usuarioLogado)
  if (await novaPublicacao.save()) {
    return redirect('/')
  } else {
    return render('publicar.njk', { publicacao: novaPublicacao })
  }
}

const paginaPublicacoes = async ctx => {
  const publicacoes = await Publicacao.getAll()
  return render('publicacoes.njk', { publicacoes: publicacoes })
}

const paginaPublicacoesFeed = async ctx => {
  const userId = ctx.session.userId
  const publicacoes = await Publicacao.getAllFeedFromUser(userId)
  return render('publicacoes.njk', { publicacoes: publicacoes })
}

const paginaPublicacoesDoUsuarioAutenticado = async ctx => {
  const userId = ctx.session.userId
  const publicacoes = await Publicacao.getAllFromUser(userId)
  return render('publicacoes.njk', { publicacoes: publicacoes })
}

const paginaPublicacoesDoUsuario = async ctx => {
  const nomeDoUsuario = ctx.params.usuario
  const userId = await Usuario.getUserIdFromName(nomeDoUsuario)
  const publicacoes = await Publicacao.getAllFromUser(userId)
  return render('publicacoes.njk', { publicacoes: publicacoes })
}

const paginaPublicacao = async ctx => {
  const id = ctx.params.id
  const publicacao = await Publicacao.get(id)
  return render('publicacao.njk', { publicacao: publicacao })
}

const paginaAutenticacao = ctx => {
  return render('autenticacao.njk')
}

const iniciarAutenticacao = async ctx => {
  const nome = ctx.data.nome
  const senha = ctx.data.senha
  if (await Autenticacao.autenticar(nome, senha, ctx.session)) {
    return redirect('/')
  } else {
    return render('autenticacao.njk', { erro: { msg: 'Usuario e/ou Senha Inválidos!' } })
  }
}

const finalizarAutenticacao = ctx => {
  Autenticacao.finalizar(ctx.session)
  return redirect('/entrar')
}

const getUploadURL = async ctx => {
  return Upload.getUploadURL(ctx.query.filename)
}

const autenticado = ctx => {
  if (!ctx.session.autenticado) {
    const AuthError = new Error('User not authenticated')
    AuthError.code = 'usuario.naoAutenticado'
    throw AuthError
  }
}

const naoAutenticado = ctx => {
  if (ctx.session.autenticado) {
    const AuthError = new Error('User Authenticated')
    AuthError.code = 'usuario.autenticado'
    throw AuthError
  }
}

const opcoes = {
  engine: 'nunjucks'
}

const rotas = [
  [logger, locals],
  get('/', [autenticado, paginaPublicacoesFeed]),
  get('/entrar', [naoAutenticado, paginaAutenticacao]),
  post('/entrar', [naoAutenticado, iniciarAutenticacao]),
  post('/sair', [autenticado, finalizarAutenticacao]),
  get('/cadastrar', [naoAutenticado, usuarioCadastarForm]),
  post('/cadastrar', [naoAutenticado, usuarioCadastar]),
  get('/perfil/', [autenticado, paginaPublicacoesDoUsuarioAutenticado]),
  get('/perfil/:usuario', [autenticado, paginaPublicacoesDoUsuario]),
  get('/pesquisar', indexHandler),
  get('/publicar', [autenticado, publicarForm]),
  post('/publicar', [autenticado, publicar]),
  get('/publicacoes/:id', paginaPublicacao),
  post('/publicacoes/:id/comentar', [autenticado, indexHandler]),
  get('/descobrir', [autenticado, paginaPublicacoes]),
  get('/upload-url', getUploadURL),
  error('usuario.naoAutenticado', ctx => {
    return redirect('/entrar')
  }),
  error('usuario.autenticado', ctx => {
    return redirect('/')
  }),
  error(ctx => {
    console.error(ctx.error.message)
    return status(500).send(ctx.error.message)
  })
]

const init = async () => {
  const servidor = await server(opcoes, rotas)
  nunjucks.configure('templates', { express: servidor.app })
}
init()
