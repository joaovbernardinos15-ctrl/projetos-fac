(() => {
  const botaoPlanos = document.querySelector('.btn-planos-nav[data-bs-target="#modalPlanos"]');
  if (!botaoPlanos || document.getElementById("modalPlanos")) return;

  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "modalPlanos";
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", "modalPlanosLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content modal-planos-content">
        <div class="modal-header border-0 pb-0">
          <div class="me-auto">
            <h2 class="modal-title fs-4 text-white" id="modalPlanosLabel">Planos Cinemark</h2>
            <p class="small text-white-50 mt-2 mb-0">Benefícios e valores demonstrativos. Assinaturas ainda não estão disponíveis.</p>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body p-4">
          <div class="row g-4 justify-content-center">
            <div class="col-lg-4 col-md-6">
              <div class="card-plano plano-lite">
                <div class="plano-header">
                  <i class="fa-solid fa-film icone-topo" aria-hidden="true"></i>
                  <h2>CINEMARK <span>Lite</span></h2>
                  <p class="vantagens-qtd">4 benefícios propostos</p>
                </div>
                <ul class="plano-recursos">
                  <li><i class="fa-solid fa-film" aria-hidden="true"></i> Catálogo de filmes da plataforma</li>
                  <li><i class="fa-solid fa-user" aria-hidden="true"></i> 1 perfil</li>
                  <li><i class="fa-solid fa-tv" aria-hidden="true"></i> 1 tela simultânea</li>
                  <li><i class="fa-solid fa-display" aria-hidden="true"></i> Qualidade conforme o conteúdo disponível</li>
                </ul>
                <div class="plano-footer">
                  <div class="preco">R$ 19,90<span>/mês</span></div>
                  <button type="button" class="btn-assinar btn-lite" disabled>Em breve</button>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="card-plano plano-plus">
                <div class="plano-header">
                  <i class="fa-solid fa-video icone-topo text-danger" aria-hidden="true"></i>
                  <h2>CINEMARK <span class="text-danger">Plus</span></h2>
                  <p class="vantagens-qtd">6 benefícios propostos</p>
                </div>
                <ul class="plano-recursos">
                  <li><i class="fa-solid fa-film" aria-hidden="true"></i> Catálogo de filmes da plataforma</li>
                  <li><i class="fa-solid fa-users" aria-hidden="true"></i> Até 3 perfis</li>
                  <li><i class="fa-solid fa-tv" aria-hidden="true"></i> Até 2 telas simultâneas</li>
                  <li><i class="fa-solid fa-display" aria-hidden="true"></i> Qualidade conforme o conteúdo disponível</li>
                  <li><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Sugestões personalizadas</li>
                  <li><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Ofertas na loja</li>
                </ul>
                <div class="plano-footer">
                  <div class="preco">R$ 39,90<span>/mês</span></div>
                  <button type="button" class="btn-assinar btn-plus" disabled>Em breve</button>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="card-plano plano-ultra">
                <div class="plano-header">
                  <i class="fa-solid fa-crown icone-topo text-warning" aria-hidden="true"></i>
                  <h2>CINEMARK <span class="text-warning">Ultra</span></h2>
                  <p class="vantagens-qtd">7 benefícios propostos</p>
                </div>
                <ul class="plano-recursos">
                  <li><i class="fa-solid fa-film" aria-hidden="true"></i> Catálogo de filmes da plataforma</li>
                  <li><i class="fa-solid fa-users" aria-hidden="true"></i> Até 5 perfis</li>
                  <li><i class="fa-solid fa-tv" aria-hidden="true"></i> Até 4 telas simultâneas</li>
                  <li><i class="fa-solid fa-display" aria-hidden="true"></i> Qualidade máxima disponível</li>
                  <li><i class="fa-solid fa-star" aria-hidden="true"></i> Acesso antecipado a lançamentos</li>
                  <li><i class="fa-solid fa-ban" aria-hidden="true"></i> Experiência sem anúncios</li>
                  <li><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Benefícios na loja</li>
                </ul>
                <div class="plano-footer">
                  <div class="preco">R$ 79,90<span>/mês</span></div>
                  <button type="button" class="btn-assinar btn-ultra" disabled>Em breve</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.append(modal);
})();
