# Profile Editor React App

A modern React + Vite implementation of the Wix Profile Editor with enhanced UX and dark theme.

## 🚀 Features

- **React + Vite** - Modern development stack
- **Dark Theme** - Beautiful gradient background with glassmorphism effects
- **Form Validation** - Real-time validation with user feedback
- **Loading States** - Visual feedback during save operations
- **Iframe Communication** - Seamless integration with Wix Velo
- **Test Ribbon** - Visual indicator for testing purposes
- **Responsive Design** - Works on all screen sizes

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with animations
- **PostMessage API** - Iframe communication

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

The app is structured as follows:

```
src/
├── App.jsx              # Main app component with iframe communication
├── App.css              # Global styles
├── components/
│   ├── ProfileEditor.jsx # Main profile editor component
│   └── ProfileEditor.css # Component-specific styles
└── main.jsx             # App entry point
```

## 🌐 Wix Integration

This React app is designed to work as an iframe within Wix Velo. The communication flow:

1. **App loads** → Sends "ready" message to parent
2. **Parent responds** → Sends member data
3. **User saves** → Sends "saveData" with payload
4. **Parent saves** → Sends "saveSuccess" or "saveError"
5. **User logs out** → Sends "logoutRequest"

## 🎨 Styling

- **Dark gradient background** (`#1a1a2e` → `#16213e` → `#0f3460`)
- **Glassmorphism effects** with backdrop blur
- **Animated test ribbon** with gradient colors
- **Smooth transitions** and hover effects
- **Custom scrollbars** with blue gradient

## 🧪 Testing

The app includes a test ribbon that displays "🧪 This is a test from GitHub and Cursor" to verify deployment.

## 📱 Responsive

- Mobile-first design
- Flexible layout that adapts to screen size
- Touch-friendly buttons and inputs

## 🔄 State Management

Uses React hooks for state management:
- `useState` for form data and UI state
- `useEffect` for iframe communication
- Controlled components for form inputs

## 🚀 Deployment

Build the app and deploy the `dist` folder to your hosting service. The app works as a standalone application or embedded iframe.

## 📄 License

This project is part of the LVA Wix Admin system.
