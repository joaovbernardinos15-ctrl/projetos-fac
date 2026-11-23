-- =====================================================================
-- CINEMARK - MODELO RELACIONAL MYSQL
-- Estrutura do prototipo; regras de fluxo ficam na aplicacao.
-- Compatível com MySQL 8.0.16+ / MySQL Workbench
-- =====================================================================

CREATE DATABASE IF NOT EXISTS cinemark CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cinemark;

-- ---------------------------------------------------------------------
-- USUARIOS
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome           VARCHAR(120) NOT NULL,
    email          VARCHAR(190) NOT NULL,
    senha_hash     VARCHAR(255) NOT NULL COMMENT 'Hash seguro; nunca senha em texto puro',
    perfil         ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
    criado_por     INT UNSIGNED NULL,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email),
    KEY idx_usuarios_perfil (perfil),
    CONSTRAINT fk_usuarios_criado_por
        FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_usuarios_nome CHECK (CHAR_LENGTH(TRIM(nome)) > 0),
    CONSTRAINT chk_usuarios_email
        CHECK (email REGEXP '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')
) ENGINE=InnoDB;

CREATE TABLE recuperacoes_senha (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id INT UNSIGNED NOT NULL,
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    expira_em  DATETIME NOT NULL,
    utilizado_em DATETIME NULL DEFAULT NULL,
    criado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_recuperacoes_token (token_hash),
    KEY idx_recuperacoes_usuario (usuario_id),
    CONSTRAINT fk_recuperacoes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- FILMES, CINEMAS E SESSOES
-- ---------------------------------------------------------------------
CREATE TABLE generos (
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_generos_nome (nome),
    CONSTRAINT chk_generos_nome CHECK (CHAR_LENGTH(TRIM(nome)) > 0)
) ENGINE=InnoDB;

CREATE TABLE filmes (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    titulo         VARCHAR(190) NOT NULL,
    genero_id      INT UNSIGNED NOT NULL,
    ano            SMALLINT UNSIGNED NOT NULL,
    classificacao  ENUM('L','10','12','14','16','18') NOT NULL,
    poster         VARCHAR(500) NULL,
    sinopse        TEXT NULL,
    fonte_video    VARCHAR(500) NULL,
    em_cartaz      TINYINT(1) NOT NULL DEFAULT 1,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_filmes_titulo (titulo),
    KEY idx_filmes_genero (genero_id),
    KEY idx_filmes_em_cartaz (em_cartaz),
    CONSTRAINT fk_filmes_genero
        FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE RESTRICT,
    CONSTRAINT chk_filmes_titulo CHECK (CHAR_LENGTH(TRIM(titulo)) > 0),
    CONSTRAINT chk_filmes_ano CHECK (ano BETWEEN 1888 AND 2100),
    CONSTRAINT chk_filmes_cartaz CHECK (em_cartaz IN (0,1)),
    CONSTRAINT chk_filmes_video CHECK (
        fonte_video IS NULL
        OR fonte_video LIKE 'https://%'
        OR (fonte_video NOT LIKE '%:%' AND fonte_video NOT LIKE '//%')
    )
) ENGINE=InnoDB;

CREATE TABLE cinemas (
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_cinemas_nome (nome),
    CONSTRAINT chk_cinemas_nome CHECK (CHAR_LENGTH(TRIM(nome)) > 0)
) ENGINE=InnoDB;

CREATE TABLE salas (
    id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    cinema_id INT UNSIGNED NOT NULL,
    numero    TINYINT UNSIGNED NOT NULL,
    capacidade TINYINT UNSIGNED NOT NULL DEFAULT 40,
    PRIMARY KEY (id),
    UNIQUE KEY uq_salas_cinema_numero (cinema_id, numero),
    KEY idx_salas_cinema (cinema_id),
    CONSTRAINT fk_salas_cinema
        FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE,
    CONSTRAINT chk_salas_numero CHECK (numero > 0),
    CONSTRAINT chk_salas_capacidade CHECK (capacidade > 0)
) ENGINE=InnoDB;

CREATE TABLE horarios_padrao (
    id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    sala_id INT UNSIGNED NOT NULL,
    horario TIME NOT NULL,
    tipo    ENUM('2D','3D') NOT NULL DEFAULT '2D',
    idioma  ENUM('Dublado','Original') NOT NULL DEFAULT 'Dublado',
    PRIMARY KEY (id),
    UNIQUE KEY uq_horarios_sala_hora (sala_id, horario),
    CONSTRAINT fk_horarios_sala
        FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sessoes (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    filme_id     INT UNSIGNED NOT NULL,
    sala_id      INT UNSIGNED NOT NULL,
    inicio_em    DATETIME NOT NULL,
    duracao_min  SMALLINT UNSIGNED NOT NULL DEFAULT 120,
    tipo         ENUM('2D','3D') NOT NULL DEFAULT '2D',
    idioma       ENUM('Dublado','Original') NOT NULL DEFAULT 'Dublado',
    esgotada     TINYINT(1) NOT NULL DEFAULT 0,
    criado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_sessoes_sala_inicio (sala_id, inicio_em),
    KEY idx_sessoes_filme_inicio (filme_id, inicio_em),
    KEY idx_sessoes_sala_inicio (sala_id, inicio_em),
    CONSTRAINT fk_sessoes_filme
        FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    CONSTRAINT fk_sessoes_sala
        FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE RESTRICT,
    CONSTRAINT chk_sessoes_duracao CHECK (duracao_min > 0),
    CONSTRAINT chk_sessoes_esgotada CHECK (esgotada IN (0,1))
) ENGINE=InnoDB;

-- A aplicacao deve validar se sessoes da mesma sala se sobrepoem.

-- ---------------------------------------------------------------------
-- INGRESSOS E RESERVAS
-- ---------------------------------------------------------------------
CREATE TABLE reservas (
    id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
    codigo            CHAR(8) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    sessao_id         INT UNSIGNED NOT NULL,
    usuario_id        INT UNSIGNED NULL,
    cliente_nome      VARCHAR(120) NOT NULL,
    email             VARCHAR(190) NULL,
    tipo_ingresso     ENUM('inteira','meia') NOT NULL,
    valor_unitario    INT UNSIGNED NOT NULL,
    desconto_percentual TINYINT UNSIGNED NOT NULL DEFAULT 0,
    valor_total       INT UNSIGNED NOT NULL,
    plano_titulo      VARCHAR(40) NULL,
    status            ENUM('confirmada','cancelada') NOT NULL DEFAULT 'confirmada',
    criada_em         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelada_em      DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reservas_codigo (codigo),
    UNIQUE KEY uq_reservas_id_sessao (id, sessao_id),
    KEY idx_reservas_sessao (sessao_id),
    KEY idx_reservas_usuario (usuario_id),
    CONSTRAINT fk_reservas_sessao
        FOREIGN KEY (sessao_id) REFERENCES sessoes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reservas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_reservas_nome CHECK (CHAR_LENGTH(TRIM(cliente_nome)) > 0),
    CONSTRAINT chk_reservas_desconto CHECK (desconto_percentual <= 100)
) ENGINE=InnoDB;

-- O cancelamento da reserva deve remover seus assentos para libera-los.
CREATE TABLE reserva_assentos (
    reserva_id      INT UNSIGNED NOT NULL,
    sessao_id       INT UNSIGNED NOT NULL,
    assento         CHAR(2) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    PRIMARY KEY (sessao_id, assento),
    KEY idx_reserva_assentos_reserva (reserva_id),
    CONSTRAINT fk_ra_reserva
        FOREIGN KEY (reserva_id, sessao_id)
        REFERENCES reservas(id, sessao_id) ON DELETE CASCADE,
    CONSTRAINT chk_ra_assento CHECK (assento REGEXP '^[A-E][1-8]$')
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- LOJA
-- ---------------------------------------------------------------------
CREATE TABLE categorias_produto (
    id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(60) NOT NULL,
    descricao VARCHAR(255) NOT NULL DEFAULT '',
    icone     VARCHAR(60) NULL,
    imagem    VARCHAR(500) NULL,
    alt       VARCHAR(255) NULL,
    ordem     TINYINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categorias_nome (nome),
    CONSTRAINT chk_categorias_nome CHECK (CHAR_LENGTH(TRIM(nome)) > 0)
) ENGINE=InnoDB;

CREATE TABLE produtos (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    categoria_id   INT UNSIGNED NOT NULL,
    nome           VARCHAR(120) NOT NULL,
    descricao      VARCHAR(255) NOT NULL DEFAULT '',
    ativo          TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_produtos_categoria_nome (categoria_id, nome),
    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias_produto(id) ON DELETE RESTRICT,
    CONSTRAINT chk_produtos_nome CHECK (CHAR_LENGTH(TRIM(nome)) > 0),
    CONSTRAINT chk_produtos_ativo CHECK (ativo IN (0,1))
) ENGINE=InnoDB;

CREATE TABLE produto_variantes (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    produto_id     INT UNSIGNED NOT NULL,
    tamanho        VARCHAR(40) NOT NULL,
    preco_centavos INT UNSIGNED NOT NULL,
    ativo          TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_produto_variante (produto_id, tamanho),
    KEY idx_produto_variantes_produto (produto_id),
    CONSTRAINT fk_pv_produto
        FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    CONSTRAINT chk_pv_tamanho CHECK (CHAR_LENGTH(TRIM(tamanho)) > 0),
    CONSTRAINT chk_pv_ativo CHECK (ativo IN (0,1))
) ENGINE=InnoDB;

CREATE TABLE pedidos (
    id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
    codigo             CHAR(8) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    usuario_id         INT UNSIGNED NULL,
    cliente_nome       VARCHAR(120) NOT NULL,
    email              VARCHAR(190) NOT NULL,
    unidade            VARCHAR(120) NOT NULL,
    subtotal_centavos  INT UNSIGNED NOT NULL,
    desconto_percentual TINYINT UNSIGNED NOT NULL DEFAULT 0,
    total_centavos     INT UNSIGNED NOT NULL,
    plano_titulo       VARCHAR(40) NULL,
    metodo_pagamento   ENUM('balcao','pix','cartao') NOT NULL,
    cartao_ultimos4    CHAR(4) CHARACTER SET ascii COLLATE ascii_bin NULL,
    status             ENUM('confirmado','preparo','pronto','entregue','cancelado') NOT NULL DEFAULT 'confirmado',
    criada_em          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em      DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    cancelada_em       DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_pedidos_codigo (codigo),
    KEY idx_pedidos_usuario (usuario_id),
    KEY idx_pedidos_status (status),
    CONSTRAINT fk_pedidos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_pedidos_nome CHECK (CHAR_LENGTH(TRIM(cliente_nome)) > 0),
    CONSTRAINT chk_pedidos_desconto CHECK (desconto_percentual <= 100)
) ENGINE=InnoDB;

CREATE TABLE pedido_itens (
    id                       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    pedido_id                INT UNSIGNED NOT NULL,
    produto_id               INT UNSIGNED NULL,
    variante_id              INT UNSIGNED NULL,
    nome_produto             VARCHAR(120) NOT NULL,
    categoria_produto        VARCHAR(60) NOT NULL,
    tamanho                  VARCHAR(40) NOT NULL DEFAULT '',
    preco_unitario_centavos  INT UNSIGNED NOT NULL,
    quantidade               TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_pedido_item (pedido_id, produto_id, variante_id, nome_produto),
    KEY idx_pi_pedido (pedido_id),
    KEY idx_pi_produto (produto_id),
    CONSTRAINT fk_pi_pedido
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_pi_produto
        FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL,
    CONSTRAINT fk_pi_variante
        FOREIGN KEY (variante_id) REFERENCES produto_variantes(id) ON DELETE SET NULL,
    CONSTRAINT chk_pi_preco CHECK (preco_unitario_centavos >= 0),
    CONSTRAINT chk_pi_qtd CHECK (quantidade BETWEEN 1 AND 99)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- PLANOS E ASSINATURAS
-- ---------------------------------------------------------------------
CREATE TABLE planos (
    id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
    codigo             VARCHAR(20) NOT NULL,
    nome               VARCHAR(40) NOT NULL,
    preco_centavos     INT UNSIGNED NOT NULL,
    desconto_ingressos TINYINT UNSIGNED NOT NULL DEFAULT 0,
    desconto_loja      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    max_perfis         TINYINT UNSIGNED NOT NULL DEFAULT 1,
    max_telas          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    ordem              TINYINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_planos_codigo (codigo),
    UNIQUE KEY uq_planos_nome (nome),
    CONSTRAINT chk_planos_limites CHECK (max_perfis > 0 AND max_telas > 0),
    CONSTRAINT chk_planos_desc_ing CHECK (desconto_ingressos <= 100),
    CONSTRAINT chk_planos_desc_loja CHECK (desconto_loja <= 100)
) ENGINE=InnoDB;

CREATE TABLE plano_beneficios (
    plano_id INT UNSIGNED NOT NULL,
    ordem    TINYINT UNSIGNED NOT NULL,
    descricao VARCHAR(190) NOT NULL,
    icone    VARCHAR(60) NULL,
    PRIMARY KEY (plano_id, ordem),
    CONSTRAINT fk_pb_plano
        FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE assinaturas (
    id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
    codigo           CHAR(8) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    usuario_id       INT UNSIGNED NOT NULL,
    plano_id         INT UNSIGNED NOT NULL,
    preco_centavos   INT UNSIGNED NOT NULL,
    metodo_pagamento ENUM('pix','cartao') NOT NULL,
    cartao_ultimos4  CHAR(4) CHARACTER SET ascii COLLATE ascii_bin NULL,
    status           ENUM('ativa','cancelada','substituida','expirada') NOT NULL DEFAULT 'ativa',
    inicio_em        DATETIME NOT NULL,
    fim_em           DATETIME NOT NULL,
    criada_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em    DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_assinaturas_codigo (codigo),
    KEY idx_assinaturas_usuario_status (usuario_id, status),
    KEY idx_assinaturas_plano (plano_id),
    CONSTRAINT fk_assinaturas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_assinaturas_plano
        FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE RESTRICT,
    CONSTRAINT chk_assinaturas_periodo CHECK (fim_em > inicio_em)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- CONTATO
-- ---------------------------------------------------------------------
CREATE TABLE mensagens (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id    INT UNSIGNED NULL,
    nome          VARCHAR(120) NOT NULL,
    email         VARCHAR(190) NOT NULL,
    assunto       VARCHAR(190) NOT NULL,
    mensagem      TEXT NOT NULL,
    lida          TINYINT(1) NOT NULL DEFAULT 0,
    lida_em       DATETIME NULL DEFAULT NULL,
    respondida    TINYINT(1) NOT NULL DEFAULT 0,
    resposta      TEXT NULL,
    respondida_em DATETIME NULL DEFAULT NULL,
    criada_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_mensagens_email (email),
    KEY idx_mensagens_usuario (usuario_id),
    KEY idx_mensagens_lida (lida),
    CONSTRAINT fk_mensagens_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_mensagens_nome CHECK (CHAR_LENGTH(TRIM(nome)) > 0),
    CONSTRAINT chk_mensagens_assunto CHECK (CHAR_LENGTH(TRIM(assunto)) >= 3),
    CONSTRAINT chk_mensagens_texto CHECK (CHAR_LENGTH(TRIM(mensagem)) >= 10),
    CONSTRAINT chk_mensagens_lida CHECK (lida IN (0,1)),
    CONSTRAINT chk_mensagens_respondida CHECK (respondida IN (0,1))
) ENGINE=InnoDB;
