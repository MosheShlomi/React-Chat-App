# React Chat App

## 📜 Overview

The **React Chat App** is a dynamic, real-time messaging application that allows users to chat instantly with one another. Built with **React** and powered by **Firebase**, the app offers robust features like user authentication, message notifications, file, image and voice sharing, emoji support, and more. Optimized for fast development using **Vite**, the app leverages **Zustand** for state management to ensure a smooth and scalable user experience.

## 🚀 Features

- **Real-Time Messaging**: Stay connected with real-time updates using **Firebase Firestore**.
- **File and Image Sharing**: Seamlessly upload and share images, documents, and other files.
- **User Authentication**: Secure authentication powered by **Firebase Authentication** for user management.
- **Emoji Picker**: Enhance conversations with expressive emojis using **emoji-picker-react**.
- **Toast Notifications**: Instant feedback and notifications powered by **react-toastify**.
- **Responsive Design**: Optimized UI for both mobile and desktop, built with **MUI** and **Sass**.
- **Voice and Image Capture**: Custom voice message and image capture features for richer conversations.
- **User-Friendly Interface**: Clean and easy-to-navigate UI for a seamless chat experience.

## 🛠️ Built With

- **Frontend**: [React](https://reactjs.org/), [Sass](https://sass-lang.com/), [MUI](https://mui.com/)
- **State Management**: [Zustand](https://zustand.pmnd.rs/)
- **Backend Services**: [Firebase](https://firebase.google.com/)
- **Development Tools**: [Vite](https://vitejs.dev/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## 📦 Installation

1. Clone the Repository

   ```bash
   git clone https://github.com/MosheShlomi/React-Chat-App.git
   cd React-Chat-App
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Firebase**: 
   Create a .env file in the project root and add your Firebase config keys:
   ```
   VITE_API_KEY=<your-firebase-api-key>
   VITE_PUBLIC_URL=/React-Chat-App
   ```
5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

6. **Lint and Format Code**:
   To ensure code quality, use:
   ```bash
   npm run lint
   npm run format
   ```

7. **Build for Production**:
   ```bash
   npm run build
   ```

8. **Deploy**:
   Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## 🌐 Live Demo

Check out the live demo on GitHub Pages: [React Chat App](https://mosheshlomi.github.io/React-Chat-App/)


#### 📚 Future Enhancements - Version 2 Features (Planned)

The next version will include performance improvements and new features:

- **Image Optimization**: Automatically compress images on upload to reduce loading times.
- **Audio/Video Calls**: Real-time calling using **WebRTC** or similar APIs.
- **Message Search**: Search messages by keywords or users.
- **Dark Mode**: Toggle for a night mode.
- **Chat Rooms**: Support for multiple chat rooms and group chats.