# BARATOZANDO — Roachin' Around

## M0 — Cockroach Movement Lab

Primeiro vertical slice técnico do novo jogo da Tehkné Solutions. O M0 prova apenas o controle da protagonista antes de combate, inimigos ou Adaptation Engine.

### Stack

- Phaser 3.90.0
- TypeScript
- Vite
- Arcade Physics
- grid de mundo 32×32
- personagem em canvas RGBA 64×64

### Controles

- `A / ←` — esquerda
- `D / →` — direita
- `Shift` — correr
- `Space` — pular
- `Ctrl / K` — esquiva
- `R` — respawn de debug

### Rodar normalmente

```bash
npm install
npm run dev
```

### Testes

```bash
npm test
```

Os testes puros cobrem configuração, coyote time, jump buffer, dodge, máquina de estados, dano/proteção, respawn e invariantes da sala.

### Build de produção

```bash
npm run build
```

O build normal usa Vite e requer `npm install` concluído.

### Fallback sem registry npm

O ambiente usado para gerar este checkpoint não possui DNS para o registry npm. Para permitir verificação estrutural mesmo assim existe:

```bash
npm run build:offline
```

Esse fallback transpila o TypeScript com `tsc`, gera `dist/` estático e carrega Phaser 3.90.0 por CDN em runtime. Ele **não substitui** a verificação final do bundle Vite.

### Escopo M0

Incluído: walk, run, jump variável, coyote time, jump buffer, dodge, hazard, HP temporário, hurt, death, respawn, checkpoint, câmera e atmosfera dark.

Excluído por design: inimigos, ataque, Adaptation Engine, power-ups, inventário, metamorfose, backend e touch UI.
