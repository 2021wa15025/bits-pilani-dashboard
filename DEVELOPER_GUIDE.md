# 🎓 BITS Pilani Dashboard - Developer Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/2021wa15025/bits-pilani-dashboard.git
cd "NEW PORTAL"

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 📁 Project Structure

```
├── components/              # React components (88 components)
│   ├── ui/                 # Reusable UI components (Radix UI)
│   ├── widgets/            # Dashboard widgets
│   └── *.tsx              # Feature components
├── contexts/               # React Context providers
├── data/                  # Sample data and types
├── utils/                 # Utility functions and helpers
├── src/                   # Main source files
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev           # Start dev server (Vite)
npm run build         # Build for production
npm run preview       # Preview production build

# Code Quality
npm run lint          # Run ESLint
npm run type-check    # TypeScript type checking

# Deployment
npm run deploy        # Deploy to GitHub Pages
```

## ⚙️ Configuration Files

### Essential Files:
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS settings
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint rules
- `netlify.toml` - Netlify deployment settings

## 🎨 Styling & UI

### Tailwind CSS
- **Framework**: Tailwind CSS 3.4
- **Components**: Radix UI primitives
- **Theme**: Dark/Light mode support
- **Responsive**: Mobile-first design

### Component Library:
```tsx
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Dialog } from './components/ui/dialog';
```

## 📱 Key Features

### 🏠 Dashboard
- Student overview with stats
- Course progress tracking
- Recent activity feed
- Quick access widgets

### 📚 Course Management
- Semester organization
- Grade tracking
- Assignment management
- Course materials

### 📝 Notes System
- Rich text editor
- File attachments
- Categories and tags
- Search functionality

### 📅 Calendar
- Event scheduling
- Academic calendar
- Deadline tracking
- Holiday management

### 🤖 AI Assistant
- Conversational interface
- Student support
- Query assistance
- 24/7 availability

### 👥 Admin Panel
- Enhanced dashboard
- User management
- Ticket system
- Analytics

## 🔧 Development Guidelines

### Code Style:
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful component names
- Add proper error handling

### Performance:
- Lazy load components
- Use React.memo for optimization
- Implement loading states
- Optimize bundle size

### Accessibility:
- Add ARIA labels
- Support keyboard navigation
- Use semantic HTML
- Test with screen readers

## 🌐 Deployment

### Netlify (Recommended):
```bash
# Automatic deployment on git push
git push origin main
```

### Manual Build:
```bash
npm run build
# Deploy dist/ folder to any hosting service
```

## 🔍 Troubleshooting

### Common Issues:

**Dev server won't start:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**TypeScript errors:**
```bash
# Run type check
npm run type-check
# Fix errors before building
```

**Build fails:**
```bash
# Check for lint errors
npm run lint
# Fix all ESLint warnings
```

## 📊 Performance Optimization

### Bundle Analysis:
```bash
npm run build
# Check dist/ folder sizes
# Large files > 500KB should be code-split
```

### Optimization Tips:
- Use lazy loading for pages
- Implement virtual scrolling for large lists
- Optimize images with lazy loading
- Use React.memo for expensive components

## 🧪 Testing (Future Enhancement)

### Setup Testing:
```bash
npm install -D @testing-library/react vitest
# Add test scripts to package.json
```

## 🔐 Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_BASE_URL=your_api_url
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## 🆘 Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include error messages and browser info
4. Provide steps to reproduce

---

**Happy Coding! 🎉**