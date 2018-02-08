CREATE TABLE IF NOT EXISTS usuarios(
	id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(55)
);

CREATE TABLE IF NOT EXISTS publicacoes(
	id SERIAL PRIMARY KEY,
    localizacao varchar(255),
    foto varchar(255) not null,
    legenda text,
    filtro varchar(50) not null default '',
    dono bigint NOT NULL,
    FOREIGN KEY (dono) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seguidores (
    id SERIAL PRIMARY KEY,
    seguindo bigint NOT NULL,
    seguidor bigint NOT NULL,
    FOREIGN KEY (seguidor) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (seguindo) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    conteudo text NOT NULL,
    publicacao bigint NOT NULL,
    usuario bigint NOT NULL,
    FOREIGN KEY (publicacao) REFERENCES publicacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);