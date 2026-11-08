# Publicar JSB Construcción en GitHub Pages

El sitio es estático: no tiene build ni backend. Se puede publicar directamente desde la raíz del repositorio.

## 0. Vercel para mostrar al cliente

La vía más rápida para tener una URL visual:

1. Sube este repositorio a GitHub.
2. Entra a [vercel.com/new](https://vercel.com/new) e importa el repositorio.
3. Configura:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** vacío
   - **Output Directory:** `./`
4. Pulsa **Deploy**. Vercel entregará una URL `*.vercel.app`.
5. Comparte esa URL con el cliente.

`vercel.json` ya está incluido. No requiere variables de entorno.

Para el dominio definitivo, actualiza después `canonical`, OG y sitemap con la URL de Vercel o el dominio propio.

## 1. Crear el repositorio

Crea un repositorio vacío en GitHub y sube el contenido de esta carpeta. No subas `node_modules`, `.pnpm-store`, `.tmp`, `remotion/out` ni los `.zip`; ya están excluidos por `.gitignore`.

## 2. Elegir la URL final

Antes de publicar, define una de estas opciones:

- **GitHub Pages:** `https://<usuario>.github.io/<repositorio>/`
- **Dominio propio:** `https://jsbconstruccion.cl/` (o el dominio real)

Reemplaza `https://jsbconstruccion.cl` por esa URL en:

- `index.html` (`canonical`, Open Graph, Twitter, JSON-LD, `llms` si aplica)
- `sitemap.xml`
- `robots.txt`
- `llms.txt`
- `README.md` y `SEO-AUDIT.md` (documentación)

Ejemplo en PowerShell desde la raíz:

```powershell
$old = 'https://jsbconstruccion.cl'
$new = 'https://usuario.github.io/repositorio'
Get-ChildItem index.html,sitemap.xml,robots.txt,llms.txt,README.md,SEO-AUDIT.md |
  ForEach-Object {
    (Get-Content $_.FullName -Raw).Replace($old, $new) |
      Set-Content $_.FullName -NoNewline
  }
```

Si usas dominio propio, agrega un archivo `CNAME` con el dominio (sin `https://`).

## 3. Activar GitHub Pages

En GitHub:

1. **Settings → Pages**
2. **Build and deployment → Source: Deploy from a branch**
3. Branch: `main` · Folder: `/ (root)`
4. Guarda y espera el primer deploy.
5. Activa **Enforce HTTPS**.

El archivo `.nojekyll` ya está incluido para que GitHub Pages no procese el sitio con Jekyll.

## 4. Verificar después del deploy

- Abrir la URL publicada y comprobar que cargan CSS, fuentes, imágenes y video.
- Verificar `https://TU-DOMINIO/sitemap.xml`, `/robots.txt` y `/llms.txt` con estado 200.
- Confirmar que el `canonical` y `og:url` son la URL final.
- Enviar `sitemap.xml` en Google Search Console.
- Revisar la ficha de Google Business con la dirección **Montgolfier 0494, Temuco, 4811161**.
- Teléfono público confirmado: **+56 9 6675 3502**. Si la ficha de Google muestra otro número, corrígelo desde Google Business Profile.

## 5. No incluir

- `.env`, tokens, claves API o credenciales.
- `node_modules/`, `.pnpm-store/`, `.tmp/`, `remotion/out/`.
- Los `.zip` de distribución; se generan aparte.

## 6. Si usas Git local

```bash
git init -b main
git add .
git commit -m "Sitio JSB SpA"
git remote add origin https://github.com/<usuario>/<repositorio>.git
git push -u origin main
```

También puedes usar el script incluido:

```powershell
.\publish.ps1 -RepoUrl "https://github.com/<usuario>/<repositorio>.git"
```

Si Git no está instalado, instala Git for Windows o sube el contenido desde la interfaz web de GitHub.
