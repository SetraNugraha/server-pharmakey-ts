## Tech Stack

**Client:** Vite + ReactJS, Typescript, TailwindCSS

**Server:** Node, Express, Typescript, Prisma, PostgreSQL

## Run Locally

Clone the project

```bash
  git clone https://github.com/SetraNugraha/server-pharmakey
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Environtment

```bash
  copy .env.example to .env, set the value as needed
```

### Setup DB/Prisma

Generate Prisma

```bash
  npx prisma generate
```

Create Table on PostgreSQL

```bash
  npx prisma db push
```

Run Seeder (Optional)

```bash
  npm run seeder
```

### Run project

```bash
  npm run start:dev
```

## 🔗 Client Repository

https://github.com/SetraNugraha/client-pharmakey-ts
