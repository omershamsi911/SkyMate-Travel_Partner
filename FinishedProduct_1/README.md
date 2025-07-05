# SkyMate - Your Ultimate Travel Companion

SkyMate is a modern, responsive flight booking application built with React, TypeScript, and Firebase. It features a beautiful UI with dark/light theme support, Firebase authentication, and dedicated pages for all travel-related activities.

## 🚀 Features

### ✨ Core Features
- **Flight Search & Booking**: Comprehensive flight search with filters and booking functionality
- **User Authentication**: Firebase-powered login/signup with Google OAuth
- **Protected Routes**: Secure access to user-specific features
- **Theme Support**: Dark and light mode with persistent preferences
- **Responsive Design**: Mobile-first approach with beautiful animations

### 🎯 User Features
- **Upcoming Flights**: View and manage your booked flights
- **Flight History**: Track your past travel experiences with ratings and reviews
- **Wishlist**: Save dream destinations for future trips
- **Settings**: Complete profile management with security options
- **Real-time Updates**: Live flight status and notifications

### 🎨 UI/UX Features
- **Modern Design**: Glassmorphism effects with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Elements**: Hover effects and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skymate.git
   cd skymate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google provider
   - Copy your Firebase config to `src/config/firebase.ts`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Sign-in method → Google
4. Get your config from Project Settings → General → Your apps
5. Update `src/config/firebase.ts` with your config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── BookFlightPage.tsx
│   ├── UpcomingFlightsPage.tsx
│   ├── FlightHistoryPage.tsx
│   ├── SettingsPage.tsx
│   └── WishlistPage.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── config/             # Configuration files
│   └── firebase.ts
└── services/           # API services
    └── flightApi.ts
```

## 🎯 Key Features Explained

### Authentication Flow
- Users can sign up/login with email/password or Google OAuth
- Protected routes automatically redirect unauthenticated users
- User state is managed globally with React Context

### Theme Management
- Dark/light theme toggle with persistent storage
- Automatic theme detection based on system preferences
- Smooth transitions between themes

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Breakpoint-specific layouts and components
- Touch-friendly interactions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Firebase](https://firebase.google.com/) for backend services

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact us at support@skymate.com.

---

Made with ❤️ by the SkyMate team
