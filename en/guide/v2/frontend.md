# HSNPhira Frontend

HyperSynapse Network Phira multiplayer game server frontend application

## Project Introduction

> This project is supported by multiple top AI research institutes<br>
> This project uses various AI tools for development

This is a modern web application built with Vue 3 + TypeScript + Tailwind CSS, providing a complete frontend interface for the HSNPhira multiplayer game server.
HSNPhira Frontend is backed by HSNPhira Backend and phira-mp-logprocessor.

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Static Site Generation (SSG)**: vite-ssg

## Project Structure

```
HSNPhira/
├── public/                     # Static assets
│   ├── config/                # Configuration files
│   │   ├── app.config.json    # Application config (API routes, external service URLs, etc.)
│   │   ├── preferences.config.json  # User preference configuration
│   │   ├── version.json       # Version info (for auto-update checking)
│   │   ├── global.config.json       # Global config (server address, QQ groups, etc.)
│   │   ├── download.config.json    # Download page configuration
│   │   ├── navigation.config.json  # Navigation page configuration
│   │   ├── announcement.config.json # Announcement page configuration
│   │   ├── about.config.json       # About Us page configuration
│   │   └── docs.config.json        # Documentation page configuration
│   ├── docs/                  # Documentation directory
│   │   └── guide.md          # Guide document
│   ├── images/               # Image assets
│   ├── .well-known/          # Digital asset links
│   │   └── assetlinks.json   # Android digital asset links file
│   └── index.html            # Main HTML file
├── src/                       # Vue frontend source code
│   ├── api/                  # API layer
│   │   ├── index.ts          # API client configuration
│   │   ├── server.ts         # Server API wrapper
│   │   ├── charts.ts         # Chart-related API
│   │   └── auth.ts           # Authentication-related API
│   ├── components/           # Reusable components
│   │   ├── common/          # Common components
│   │   │   ├── Button.vue      # Button component
│   │   │   ├── Header.vue      # Header navigation component
│   │   │   ├── Footer.vue      # Footer component
│   │   │   ├── Message.vue     # Message prompt component
│   │   │   └── Table.vue       # Table component
│   │   ├── windows/         # Window components (modals, dialogs)
│   │   │   ├── Window.vue                # Base window component
│   │   │   ├── WindowChart.vue           # Chart detail window
│   │   │   ├── WindowChartDownload.vue   # Chart download window
│   │   │   ├── WindowRoomHistory.vue     # Play history window
│   │   │   ├── WindowAuth.vue            # Authentication window
│   │   │   ├── WindowRoomPlayers.vue     # Room players window
│   │   │   └── WindowManager.vue         # Window manager
│   │   ├── background/      # Background effect components
│   │   ├── Lightbox.vue     # Image lightbox component
│   │   ├── ServerStatus.vue # Server status component
│   │   └── PageUpdate.vue   # Page update notification component
│   ├── i18n/                 # Internationalization configuration
│   │   └── index.ts         # Multi-language translation files (zh, zh-TW, en, ja supported)
│   ├── router/               # Route configuration
│   ├── stores/               # State management (Pinia)
│   │   ├── index.ts         # User state management
│   │   ├── i18n.ts          # Internationalization state management
│   │   ├── theme.ts         # Theme state management (dark/light/high contrast)
│   │   └── windowManager.ts # Window manager state
│   ├── utils/                # Utility functions
│   │   ├── config.ts        # Config file loading and parsing utilities
│   │   ├── docs.ts          # Document processing utilities
│   │   ├── meta.ts          # Meta tag and SEO management utilities
│   │   ├── message.ts       # Message utility functions
│   │   └── eventBus.ts      # Event bus utility
│   ├── types/                # TypeScript type definitions
│   ├── styles/               # Global styles
│   │   └── main.css         # Tailwind CSS and custom styles
│   ├── views/                # Page view components
│   │   ├── Home.vue         # Home page
│   │   ├── RoomList.vue     # Room list
│   │   ├── ChartRanking.vue # Chart ranking
│   │   ├── UserRanking.vue  # User ranking
│   │   ├── Announcement.vue # Announcement page
│   │   ├── Agreement.vue    # User agreement page
│   │   ├── Account.vue      # Account management page
│   │   ├── PhiraDownload.vue  # Phira download page
│   │   ├── ChartDownload.vue  # Chart download page
│   │   ├── Navigation.vue     # Navigation page
│   │   ├── About.vue          # About Us page
│   │   ├── DocsHome.vue       # Documentation home page
│   │   ├── DocPage.vue        # Document detail page
│   │   └── NotFound.vue       # 404 page
│   ├── App.vue               # Root component
│   ├── main.ts               # Application entry point
│   └── vite-env.d.ts         # Vite environment type definitions
├── HSNPM/                     # Rust notification service (WebPush backend)
│   ├── src/                  # Rust source code
│   │   └── main.rs           # Main program entry
│   ├── .env.example          # Environment variable example
│   ├── Cargo.toml            # Rust dependency configuration
│   ├── Cargo.lock            # Dependency lock file
│   ├── docker-compose.yml    # Docker Compose configuration
│   ├── Dockerfile            # Docker build configuration
│   └── README.md             # HSNPM usage documentation
├── scripts/                   # Build and deployment scripts
│   ├── update-download-config.js # Update download config script
│   ├── setup-webpush.sh      # WebPush configuration script
│   ├── generate-icons.js     # PWA icon generation script
│   ├── generate-seo-files.js # SEO file generation script
│   ├── deploy-to-server.sh   # Server deployment script
│   ├── deploy-hsnpm-start.sh # HSNPM startup script
│   ├── deploy-hsnpm-systemd.service # HSNPM systemd service configuration
│   └── verify-deployment.sh  # Deployment verification script
├── images/                    # Project image assets
│   └── deploy-result.jpg     # Deployment result screenshot
├── .github/workflows/        # GitHub Actions workflows
│   ├── build-on-push.yml     # Build workflow
├── package.json              # Node.js project dependencies and scripts
├── pnpm-lock.yaml            # pnpm dependency lock file
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # Node.js environment TypeScript configuration
├── vite.config.ts            # Vite build configuration (includes API proxy, PWA support)
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── .env.development          # Development environment variables (API target URL)
├── index.html                # Main HTML file (Vite entry)
├── README.md                 # Project main documentation
└── LICENSE                   # License file
```

**Notes**:
- The project uses a modular design with clear separation of concerns
- The API layer centrally manages all network requests, making maintenance and testing easier
- Components are categorized by function; window components are used for modal interactions
- Internationalization configuration is centrally managed, supporting multi-language switching
- State management uses Pinia, replacing Vuex
- Styling is based on Tailwind CSS, supporting responsive design
- The new configuration file system supports dynamic page content management
- New PWA support allows the page to be installed as a standalone application
- New dark mode and high contrast mode theme switching
- New documentation center supporting Markdown format document rendering
- New Schema structured data for SEO optimization
- New mobile full-screen menu with scrollbar support

- `public/.well-known/` - Digital asset links directory, containing `assetlinks.json`

## Quick Start

### Environment Requirements

- **Node.js** >= 16.0.0 (recommend using 18.x or 20.x LTS versions)
- **Package Manager**: pnpm >= 8.0.0

### Install Dependencies

```bash
# If pnpm is not installed, install it first (recommended)
npm install -g pnpm

# Install project dependencies
pnpm install

# Or use npm (not recommended, may cause dependency conflicts)
# npm install
```

### Configure Backend API

**Important**: Before starting the project, you need to configure the backend API address. The project supports two configuration methods:

#### 1. Development Environment Variable Configuration (recommended for local development)
Edit the `.env.development` file:

```bash
# Backend API server address (default local development address)
VITE_API_TARGET=http://localhost:8080

# Enable Vite proxy (recommended for development)
VITE_USE_PROXY=true
```

**Configuration Notes**:
- `VITE_API_TARGET`: Backend server address, typically `http://localhost:8080` during development
- `VITE_USE_PROXY`: Whether to enable the Vite development proxy; when enabled, specific API paths will be forwarded to the backend through Vite

#### 2. Application Configuration File (recommended for production)
Edit `public/config/app.config.json`:

```json
{
  "apiMode": "remote",                    // "local" or "remote"
  "remoteBaseURL": "https://phira.htadiy.com",
  "localBaseURL": "http://localhost:8080"
}
```

**Interaction Between the Two Configurations**:
- **Recommended local development configuration**: `apiMode: "local"` + `VITE_USE_PROXY=true` + `VITE_API_TARGET=http://localhost:8080`
- **Connecting to remote server**: `apiMode: "remote"` + `VITE_USE_PROXY=false`
- **Production environment**: Set `apiMode` based on the actual deployment location (after building the frontend, switch target servers by modifying the configuration file)

**Note**: When `VITE_USE_PROXY=true`, the development proxy overrides part of the `apiMode` configuration. See the [API Integration](#api-integration) section for details.

### Development Mode

```bash
# Start the development server
pnpm dev
# or npm run dev

# The application will start at http://localhost:3000
```

**Development Notes**:
1. **Ensure the backend is running**: Before starting the frontend, make sure the backend server is running at `http://localhost:8080` (or your configured address)
2. **Proxy configuration**: If `VITE_USE_PROXY=true`, API requests will be automatically proxied to the backend
3. **Hot reload**: Code changes will automatically refresh the page, improving development efficiency
4. **Console output**: The development server will display build errors and TypeScript check results

### Build Production Version

```bash
# Run TypeScript type check and build (standard SPA mode)
pnpm build
# or npm run build

# Build output will be generated in the dist/ directory
```

**Build Notes**:
- The build process runs `vue-tsc` for type checking to ensure TypeScript code correctness
- Production builds optimize code, compress assets, and generate sourcemaps
- The build output is pure static files that can be deployed to any web server

### Build SSG (Static Site Generation) Version

```bash
# Pre-render all static routes as HTML files (SSG mode)
pnpm build:ssg
# or npm run build:ssg
```

**SSG Notes**:

SSG (Static Site Generation) pre-renders each route into a corresponding `index.html` file during build, output to the `dist/` directory. Compared to a regular SPA build, SSG offers the following advantages:

- **Better SEO**: Search engine crawlers can directly fetch complete HTML content without waiting for JS execution
- **Faster initial load**: Users get complete HTML on first visit without waiting for Vue to render
- **Social sharing friendly**: Open Graph crawlers on various platforms can correctly parse page meta information

**Pre-rendered Routes** (excluding dynamic routes that require login):

| Route | Output File |
|-------|------------|
| `/` | `dist/index.html` |
| `/rooms` | `dist/rooms/index.html` |
| `/chart-ranking` | `dist/chart-ranking/index.html` |
| `/user-ranking` | `dist/user-ranking/index.html` |
| `/agreement` | `dist/agreement/index.html` |
| `/announcement` | `dist/announcement/index.html` |
| `/chart-download` | `dist/chart-download/index.html` |
| `/phira-download` | `dist/phira-download/index.html` |
| `/navigation` | `dist/navigation/index.html` |
| `/about` | `dist/about/index.html` |
| `/docs` | `dist/docs/index.html` |
| `/docs/*` | `dist/docs/*/index.html` (dynamically generated based on docs.config.json configuration) |
| `/404` | `dist/404/index.html` |

> **Note**:
> - The `/account` route requires login authentication and is not pre-rendered by SSG; it is still rendered on the client side as SPA.
> - The `/docs/*` route is dynamically generated, producing corresponding documentation pages based on `docs.config.json` configuration.
> - The `/404` page handles non-existent routes.

**Deploying SSG Artifacts**: SSG build artifacts are fully compatible with regular builds and can be deployed with the same Nginx/Apache configuration. The `try_files $uri $uri/ /index.html;` directive should be preserved to ensure SPA fallback routing works correctly.

### Preview Production Build

```bash
# Preview production build locally
pnpm preview
# or npm run preview

# Preview server will start at http://localhost:4173
```

**Preview Features**:
- Uses Vite's preview server to simulate the production environment
- Check if the build artifacts run correctly
- Verify API proxy behavior in the production environment

## Configuration Guide

### Application Configuration (public/config/app.config.json)

```json
{
  "apiMode": "remote",                    // API mode: local or remote
  "remoteBaseURL": "https://phira.htadiy.com",  // Remote API server URL
  "localBaseURL": "http://localhost:8080",      // Local development server URL
  "routes": {                              // API route configuration
    "auth": { "login": "/api/auth/login", ... },
    "rooms": { "list": "/api/rooms/info", ... },
    "charts": {
      "rank": "/chart/:id/rank",
      "chartRank": "/topchart/chart_rank/:chart_id",
      "hotRank": "/topchart/hot_rank/:timeRange"  // Note: full path
    },
    "playtime": { "leaderboard": "/rankapi/playtime_leaderboard" }
  },
  "externalAPI": {
    "phiraBaseURL": "https://phira.5wyxi.com"  // External Phira API URL
  },
  "background": {
    "defaultImageURL": "https://webstatic.cn-nb1.rains3.com/5712x3360.jpeg"
  }
}
```

### User Preference Configuration (public/config/preferences.config.json)

Supports the following customization options:
- Theme color
- Frosted glass background transparency
- Background particle effects
- Background image
- Display language

### Global Configuration (public/config/global.config.json)

Configures globally shared information:
- Global Phira server address
- Global QQ group number
- Unified display of server address and contact information on pages

### Download Page Configuration (public/config/download.config.json)

Configures the Phira download page:
- Latest version number (e.g., v0.6.7)
- Download card configuration (title, description, button text, button link with multi-language support)

### Navigation Page Configuration (public/config/navigation.config.json)

Configures card groups and cards on the navigation page:
- Card groups (Official, Online Servers, Community Open Source Repositories) with multi-language names
- Cards with multi-language titles and links

### Announcement Page Configuration (public/config/announcement.config.json)

Configures announcement cards on the announcement page:
- Multi-language support for announcement title, time, and body
- Supports dynamic addition and modification of announcements

### About Us Page Configuration (public/config/about.config.json)

Configures the About Us page:
- Multi-language support for team introduction text
- Team member information (name, avatar, homepage link)
- Acknowledgment list (name, avatar ID, contribution description)

### Documentation Page Configuration (public/config/docs.config.json)

Configures the documentation center:
- Document ID, route name, page title, meta tags
- Document file address mapping
- Supports dynamic addition of documents

## API Integration

The project comes pre-configured with the following API endpoints and Vite development proxy:

### API Endpoint Configuration
- Authentication: `/api/auth/*`
- Rooms: `/api/rooms/*`
- Leaderboard: `/rankapi/playtime_leaderboard`
- Chart Info: `/chart/*`
- Chart Ranking: `/topchart/chart_rank/*`
- Chart Hot Ranking: `/topchart/hot_rank/*` (Note: path is `/topchart/hot_rank/`)
- User Ranking: `/user_rank/*`

### API Mode Configuration (apiMode)
The application supports two API modes, configured via `apiMode` in `public/config/app.config.json`:

```json
{
  "apiMode": "remote",                    // "local" or "remote"
  "remoteBaseURL": "https://phira.htadiy.com",
  "localBaseURL": "http://localhost:8080"
}
```

- **local mode**: API requests are sent to `localBaseURL` (typically the local development server)
- **remote mode**: API requests are sent to `remoteBaseURL` (production server)

**Note**: In the development environment, the behavior of this configuration is affected by the `VITE_USE_PROXY` environment variable:
- When `VITE_USE_PROXY=true` (default), the development server proxies specific paths to `VITE_API_TARGET`, overriding part of the `apiMode` configuration
- When `VITE_USE_PROXY=false`, the `apiMode` configuration takes full effect

### Development Proxy Configuration
The following proxy rules are configured in `vite.config.ts` (active when `VITE_USE_PROXY=true`):

```javascript
proxy: {
  '/api': { target: 'http://localhost:8080' },
  '/rankapi': { target: 'http://localhost:8080' },
  '/chart': { target: 'http://localhost:8080' },
  '/topchart/hot_rank': { target: 'http://localhost:8080' },
  '/topchart/chart_rank': { target: 'http://localhost:8080' },
  '/chart_rank': { target: 'http://localhost:8080' },
  '/user_rank': { target: 'http://localhost:8080' }
}
```

**Proxy and apiMode Interaction**:
- In the development environment, for requests using the Axios API instance, the proxy takes over and ignores `apiMode`
- In the development environment, requests using direct `fetch()` follow the `apiMode` configuration
- In the production environment, all requests follow the `apiMode` configuration

### External API
Some features (such as chart details, user avatars) directly call the external Phira API (`https://phira.5wyxi.com`). These requests do not go through the proxy and are not affected by `apiMode`.

### Recommended Configuration Schemes
1. **Local development**: Set `apiMode: "local"`, `VITE_USE_PROXY=true`, `VITE_API_TARGET=http://localhost:8080`
2. **Connecting to remote server**: Set `apiMode: "remote"`, `VITE_USE_PROXY=false`
3. **Production environment**: Set `apiMode` to `local` or `remote` based on the deployment location

## Deployment

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Compression Optimization

The project automatically generates Brotli (`.br`) and Gzip (`.gz`) compressed files during build. To enable server-side pre-compressed file support, update the Nginx configuration:

```nginx
# Add the following configuration in the http or server block
gzip_static on;          # Enable pre-compressed .gz files
brotli_static on;        # Enable pre-compressed .br files (requires ngx_brotli module)
gzip_vary on;            # Add Vary: Accept-Encoding response header

# If the ngx_brotli module is not installed, enable dynamic compression
# gzip on;
# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
# brotli on;
# brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

Complete Nginx configuration example (with pre-compressed file support):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Compression optimization configuration
    gzip_static on;
    brotli_static on;
    gzip_vary on;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Note**:
- Pre-compressed files are generated at build time by `vite-plugin-compression`, with no real-time compression overhead
- Ensure Nginx is compiled with `--with-http_gzip_static_module` and `--add-module=/path/to/ngx_brotli` (if Brotli support is needed)
- Browsers automatically receive the appropriate compression format based on the `Accept-Encoding` request header

## Development Guide

### Adding a New Page

1. Create a new Vue component in `src/views/`
2. Add route configuration in `src/router/index.ts`
3. Add a navigation link in the `navRoutes` array in `Header.vue`

### Adding a New API

1. Create the corresponding API module in `src/api/`
2. Define related types in `src/types/index.ts`
3. Import and use in the component

### Custom Styles

- Global styles: `src/styles/main.css`
- Tailwind configuration: `tailwind.config.js`
- Theme colors are controlled via CSS variable `--primary-color`

## Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## Showcase

You can visit the [HSNPhira official website](https://phira.htadiy.com/) to see the deployment effect
![Homepage after deployment](https://github.com/HyperSynapseNetwork/HSNPhira/blob/frontend-remake/images/deploy-result.jpg?raw=true)

## License

This project is licensed under the GNU Affero General Public License (AGPL) 3.0.

### Copyright Notice
Copyright (c) HyperSynapse Network. All rights reserved.

### Developer Obligations
Under the AGPL-3.0 license, developers who use, modify, or distribute this project must:
- Retain the original project's copyright and license notices.
- Provide complete source code when distributing.
- Any derivative works based on this project must also be open-sourced under the AGPL-3.0 license.

For detailed terms, please see the full text of the [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html) license.

## Contact

- QQ Group: 1049578201
- Email: nb3502022@outlook.com
- GitHub: https://github.com/HyperSynapseNetwork/HSNPhira

## Acknowledgments

Thank you to the following friends for their contributions to this project. Without them, this project would not be where it is today (in no particular order; apologies for any omissions):

### Development Contributions
Thank you to the following developers for their contributions to project development, testing, and funding:
*   **[TeamFlos](https://github.com/TeamFlos)**
    *   Original project **Phira**: [Phira](https://github.com/TeamFlos/Phira)
    *   Original project **Phira-MP**: [Phira-MP](https://github.com/TeamFlos/Phira-MP)
*   **[htadiy](https://github.com/htadiy)**
*   **[ExplodingKonjac](https://github.com/ExplodingKonjac)**
*   **[LY-Xiang](https://github.com/LY-Xiang)**
*   **[AFewSuns](https://github.com/AFewSuns)**

### Design, Funding, and Support
*   Thank you to **Ght/F=1** for participating in designing the project icon. **[Dmocken](https://github.com/Dmocken)** provided support for project promotion and server status monitoring.
*   Thank you to **all other donors who have supported this project**.
*   Thank you to **all players who have used services provided by HSNPhira**.

### Community Contributions
Thank you to all other developers who have contributed to the Phira open-source community ecosystem!

### Special Thanks
Thank you to **Claude** and **Deepseek** for supporting this project.
Thank you to **Rain Cloud** for supporting this project.
