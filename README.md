# Diário da Dor - Physiotherapy Pain Tracker

Uma aplicação web para acompanhamento da dor em tratamentos fisioterápicos, desenvolvida com Next.js, TypeScript e SQLite.

## 🚀 Funcionalidades

- **Autenticação simples**: Login baseado em número de telefone
- **Registro da dor**: Interface interativa para selecionar partes do corpo
- **Escala da dor**: Slider de 1-10 para medir intensidade
- **Formulário detalhado**: Informações adicionais sobre sintomas e tratamentos
- **Histórico completo**: Visualização de todos os registros anteriores
- **Design responsivo**: Interface otimizada para mobile e desktop

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de dados**: SQLite com Drizzle ORM
- **Autenticação**: Sistema simples baseado em telefone

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd diario-de-dor
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npx drizzle-kit generate
npx drizzle-kit push
```

4. (Opcional) Popule com dados de teste:
```bash
npm run seed
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse http://localhost:3000

## 🧪 Dados de Teste

Execute `npm run seed` para criar:
- **Usuário de teste**: João Silva (Telefone: 11999887766)
- **15 registros da dor** aleatórios dos últimos 30 dias
- **Formulários de tratamento** com informações detalhadas

Use o telefone **11999887766** para fazer login e testar a aplicação.

## 📱 Como Usar

1. **Primeiro Acesso**: Crie uma conta com nome e telefone
2. **Login**: Use apenas o número de telefone para entrar
3. **Registrar Dor**: 
   - Selecione a parte do corpo no diagrama
   - Defina o nível da dor (1-10)
   - Preencha informações adicionais
4. **Histórico**: Visualize todos os registros anteriores com detalhes

## 🗂️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   └── history/           # Histórico de registros
├── components/            # Componentes React
│   ├── BodyDiagram.tsx    # Diagrama interativo do corpo
│   ├── PainLevelSlider.tsx # Slider de nível da dor
│   └── TreatmentForm.tsx  # Formulário de tratamento
├── lib/                   # Utilitários e configurações
│   ├── db/               # Configuração do banco
│   └── auth.ts           # Funções de autenticação
scripts/
└── seed-data.js          # Script para dados de teste
```

## 🎨 Interface

- **Design limpo**: Interface minimalista focada na usabilidade
- **Cores intuitivas**: Verde (dor leve), amarelo (moderada), vermelho (intensa)
- **Navegação simples**: Fluxo de 3 passos para registro da dor
- **Responsivo**: Funciona bem em dispositivos móveis e desktop

## 🚀 Deploy

Para deploy em produção:

1. Build da aplicação:
```bash
npm run build
```

2. Deploy no Vercel (recomendado):
```bash
npx vercel
```

3. Configure as variáveis de ambiente se necessário

## 📄 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linting
- `npm run seed` - Popula banco com dados de teste

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.
