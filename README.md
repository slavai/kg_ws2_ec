# 🎮 Digital Store - Cyberpunk 2077 Edition

A modern digital marketplace built with **Next.js 15** and **Supabase**, featuring an immersive cyberpunk aesthetic and interactive "Asteroids 2077" background game.

## ✨ Features

### 🛒 **E-Commerce Core**
- **Product Management**: Digital products, licenses, and gift cards
- **Shopping Cart**: Redux-powered cart with persistent state
- **User Authentication**: Supabase Auth integration
- **Payment Processing**: Secure checkout workflow
- **Real-time Updates**: Live product availability

### 🎨 **Cyberpunk UI/UX**
- **Neon Aesthetics**: Custom color palette with OKLCH optimization
- **Glitch Effects**: Animated hover states and visual distortions
- **CRT Monitor**: Retro oval screen with pixel grid effects
- **Data Streams**: Animated background elements
- **Terminal Interface**: Command-line inspired components

### 🚀 **Interactive Game**
- **Asteroids 2077**: Canvas-based space shooter background
- **Physics Engine**: Inertia-based ship movement
- **Adaptive AI**: Ship speed adjusts to cursor distance  
- **Retro Graphics**: Vector-style rendering with neon trails
- **CRT Effects**: Screen persistence, noise, and interference

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15.4.5 |
| **React** | UI Library | 19.0 |
| **TypeScript** | Type Safety | Latest |
| **Tailwind CSS** | Styling (v4) | CSS-first config |
| **Supabase** | Backend & Auth | PostgreSQL |
| **Redux Toolkit** | State Management | Cart & Orders |
| **Canvas API** | Game Rendering | 2D Context |

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Supabase** account

### Installation

1. **Clone repository**
   ```bash
   git clone git@github.com:slavai/kg_ws2_ec.git
   cd digital-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Configure Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open application**  
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Performance Optimizations

- **CSS-first Theming**: Tailwind v4 `@theme` directive
- **Font Loading**: Next.js optimized Geist fonts
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based chunks
- **Canvas Rendering**: Efficient 2D graphics with RAF

## 🎮 Game Controls

| Action | Description |
|--------|-------------|
| **Mouse Movement** | Ship follows cursor with inertia |
| **Auto-Fire** | Ship automatically shoots at asteroids |
| **Scoring** | Points for destroyed asteroids |
| **Adaptive Speed** | Ship accelerates with distance |

## 🎨 Design System

### Color Palette (OKLCH)
- **Neon Cyan**: Primary accent `oklch(91.3% 0.139 195.8)`
- **Neon Pink**: Secondary accent `oklch(71.7% 0.25 360)`
- **Cyber Dark**: Background `oklch(15% 0.02 240)`
- **Glitch Red**: Error states `oklch(65% 0.25 25)`

### Typography
- **Primary**: Orbitron (cyberpunk headers)
- **Mono**: Fira Code (terminal text)
- **System**: Geist Sans (body text)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── game/              # Asteroids 2077 game
│   ├── layout/            # Header, navigation
│   ├── products/          # E-commerce components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities, configs
├── styles/               # Cyberpunk theme system
└── types/                # TypeScript definitions
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build  
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript validation
```

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🚀 Deployment

Optimized for **Vercel** deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/slavai/kg_ws2_ec)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] **Mobile Optimization**: Responsive game controls
- [ ] **Payment Gateway**: Stripe integration
- [ ] **Admin Dashboard**: Product management UI
- [ ] **User Profiles**: Order history and preferences
- [ ] **WebGL Upgrade**: Enhanced visual effects

---

<div align="center">

**Built with ❤️ for the cyberpunk future**

[Demo](https://kg-ws2-ec.vercel.app) • [Issues](https://github.com/slavai/kg_ws2_ec/issues) • [Discussions](https://github.com/slavai/kg_ws2_ec/discussions)

</div>