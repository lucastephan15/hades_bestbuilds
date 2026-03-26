# Hades Build Guide & TTK Calculator 🐍🗡️

Um projeto pessoal e interativo ("Compêndio") desenvolvido para estruturar, filtrar e analisar matematicamente as melhores sinergias do jogo **Hades** (Supergiant Games).

## 🌟 O que é?
Este guia foi criado para compilar as builds mais poderosas do jogo (baseadas no "meta" da comunidade). Mais do que apenas listar as Dádivas (Boons), a aplicação foca no **Theorycrafting**: dissecando a Matemática do jogo.

O sistema calcula automaticamente valores baseando-se especificamente nos bônus passivos (aditivos cruzados) e de Aspecto (multiplicativos):
- **DPS Estimado (Damage Per Second):** O fluxo de dano da rotação perfeita da arma e cast.
- **TTK Personalizado (Time to Kill):** Quanto tempo exato (em segundos) o jogador levaria para drenar a vida máxima dos grandes chefes (Meg, Hidra, Teseu, Astérios e Hades) parado batendo neles.
- **Dano de Burst Máximo:** O valor destrutivo do impacto principal na build de one-shot (como o escudo Beowulf).

## 🚀 Funcionalidades
- **Zero Instalações (Plug-and-Play):** Uma página totalmente estática (Vanilla HTML/CSS/JS) offline. Qualquer um pode baixar e dar dois cliques para interagir.
- **Sistema Customizado de Filtros:** Filtre a grade de habilidades pela Categoria, Dificuldade, Deuses Focais ou pelas Armas Infernais.
- **Micro-interações de Hover (Tooltips):** Passe o mouse sobre os painéis, atributos ou as fotos dos deuses para descobrir instantaneamente os segredos do código. Veja explicações matemáticas profundas ou simplesmente as descrições originais em português do que a habilidade causa In-Game.

## 🕹️ Como Usar (Para Usuários)
Não é necessário instalar `node` ou subir `localhost`, apenas clone ou baixe este projeto:
```bash
git clone https://github.com/lucastephan15/hades_bestbuilds.git
# E apenas dê um Duplo Clique no arquivo index.html!
```

## 🛠️ Arquitetura do Repositório
- `js/data.js`: Motor de matriz matemática de cada build. Embutido estaticamente para contornar qualquer limite do CORS.
- `js/app.js`: Script leve que executa as fórmulas dinâmicas de TTK cruzando contra HP fixo dos chefões.
- `css/style.css`: O design visual polido criado do zero referenciando o UI luxuoso do jogo (Blood Red, Ouro, e Deep Abyss/Dark Mode).
- `assets/`: Biblioteca de imagens otimizadas mantidas localmente (bênçãos, espelho da noite e chefes).

---
*Disclaimer: "Hades" é uma marca registrada da Supergiant Games. Este guia é Theotycraft com propósitos educacionais para a comunidade. Nenhuma intenção de violação de direitos autorais.*
