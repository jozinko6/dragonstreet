# Dragon Street Food Hlohovec

Objednavaci system pre lokalny street-food v Hlohovci. Aplikacia je postavena na Next.js, Prisma, Supabase Postgres a Supabase Storage pre obrazky menu.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS, shadcn/ui komponenty
- Prisma ORM
- Supabase Postgres
- Supabase Storage bucket `menu-images`
- Vercel deployment

## Lokalny start

```bash
bun install
cp .env.example .env
bun run db:generate
bun run dev
```

Aplikacia bezi na `http://localhost:3000`.

## Environment premmenne

Minimalne nastav:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_STORAGE_BUCKET="menu-images"
STAFF_PANEL_PASSWORD=""
ADMIN_PANEL_PASSWORD=""
KITCHEN_PANEL_PASSWORD=""
COURIER_PANEL_PASSWORD=""
```

`SUPABASE_SERVICE_ROLE_KEY` patri iba na server. Nikdy ho nedavaj do klientskych premennych.

## Databaza

Projekt je pripraveny pre Supabase Postgres cez Prisma.

```bash
bun run db:migrate
bun run db:seed
```

Pre lokalny vyvoj alebo rychle zarovnanie schema/databaza:

```bash
bun run db:push
```

## Supabase Storage

V Supabase vytvor public bucket:

```text
menu-images
```

Admin upload pouziva endpoint `POST /api/admin/upload`, validuje JPG/PNG/WebP do 5 MB a uklada URL obrazka do menu polozky.

## Vercel deploy

1. Importuj GitHub repozitar do Vercel.
2. Nastav env premmenne z `.env.example`.
3. Pouzi build command:

```bash
bun run build
```

4. Pred prvym produkcnym deployom spusti migracie proti Supabase:

```bash
bun run db:migrate
bun run db:seed
```

`postinstall` automaticky spusta `prisma generate`.

## Staff panely

Panely su dostupne cez hash route:

- `/#admin`
- `/#kitchen`
- `/#courier`

Ak nastavite `STAFF_PANEL_PASSWORD`, pouzije sa pre vsetky panely. Role-specific hesla (`ADMIN_PANEL_PASSWORD`, `KITCHEN_PANEL_PASSWORD`, `COURIER_PANEL_PASSWORD`) maju prednost.

## Testovaci checklist

- `bun install --frozen-lockfile`
- `bun run db:generate`
- `bun run lint`
- `bun x tsc --noEmit`
- `bun run build`
- homepage nacita menu z DB
- menu nacita polozky z DB
- checkout vytvori objednavku
- admin/kitchen/courier panely vidia objednavku po prihlaseni
- admin vie upravit menu a nahrat obrazok
- tracking objednavky zobrazuje aktualny stav

## Post-MVP

- plnohodnotna autentifikacia s rolami
- online platby kartou
- notifikacie pre kuchynu a kuriera
- mapovy tracking kuriera
- reporting a export trzieb
