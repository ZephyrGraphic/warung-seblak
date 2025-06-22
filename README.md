# Warung Seblak Parasmanan Teh Imas

Website dan dashboard admin untuk Warung Seblak Teh Imas.

## 🚀 Deployment ke Vercel (Solusi Error)

### Jika deploy dari v0 berhasil tapi dari Git error:

1. **Download code dari v0 yang berhasil**
2. **Buat repository baru di GitHub**
3. **Upload semua file dari v0 ke repository**

### Atau perbaiki repository yang error:

1. **Pastikan file-file ini sesuai dengan v0:**
   - `package.json` (check dependencies version)
   - `next.config.js` (gunakan config sederhana)
   - `tailwind.config.ts`
   - `tsconfig.json`

2. **Hapus file yang menyebabkan error:**
   - Hapus `vercel.json` jika ada
   - Hapus `.vercel` folder jika ada

3. **Push ulang ke GitHub:**
   \`\`\`bash
   git add .
   git commit -m "Fix deployment config"
   git push origin main
   \`\`\`

4. **Di Vercel:**
   - Delete project yang error
   - Import ulang dari GitHub
   - Tambah environment variables
   - Deploy

### Environment Variables di Vercel:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://esoucbztyrkpssjhcmwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzb3VjYnp0eXJrcHNzamhjbXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTcxODcsImV4cCI6MjA2NjE3MzE4N30.5nzHwWZDI70kSrgrcdMcpn-JXbIpSSLwnxz0DNWBHGo
\`\`\`

### 4. Setup Database

Jalankan SQL scripts di Supabase SQL Editor:
- `scripts/01-create-tables.sql`
- `scripts/02-seed-data.sql`
- `scripts/03-create-admin-table.sql`

## 📱 Akses Website

### Landing Page
- URL: `https://your-project-name.vercel.app/`
- Fitur: Menu, order via WhatsApp, testimoni

### Admin Dashboard
- URL: `https://your-project-name.vercel.app/admin`
- Username: `tehimas`
- Password: `tehimas123`

## 🔧 Troubleshooting

### Jika masih error saat deploy:

1. **Pastikan tidak ada file `vercel.json` yang salah**
2. **Check environment variables sudah benar**
3. **Pastikan Supabase database sudah setup**
4. **Check build logs di Vercel dashboard**

### Error umum:
- **"Function Runtimes must have a valid version"** → Hapus `vercel.json`
- **"Module not found"** → Check `package.json` dependencies
- **"Supabase connection error"** → Check environment variables

## 🛠️ Development Local

\`\`\`bash
npm install
npm run dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000)

## 📞 Support

Untuk bantuan teknis, hubungi developer.
