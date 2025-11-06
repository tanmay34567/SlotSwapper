# SlotSwapper 🔄

A modern peer-to-peer time-slot swapping platform that enables users to exchange scheduled time slots seamlessly with real-time notifications. Built with React, Node.js, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🌟 Features

- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **📅 Event Management**: Create, update, and delete your scheduled events
- **🛒 Slot Marketplace**: Browse and request available time slots from other users
- **⚡ Real-time Notifications**: Instant updates via WebSocket (Socket.IO)
- **🔄 Swap Requests**: Send, receive, accept, or reject slot swap requests
- **📱 Responsive Design**: Modern UI built with React and Tailwind CSS
- **🎨 Beautiful UI**: Clean interface with Lucide icons and toast notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Modern icon library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **Socket.IO** - WebSocket server
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/tanmay34567/SlotSwapper.git
cd SlotSwapper
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Configure Environment Variables:**

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set the following variables:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **⚠️ Important**: 
> - Replace `your_mongodb_connection_string` with your actual MongoDB URI
> - Generate a strong random string for `JWT_SECRET` (use `openssl rand -base64 32`)
> - Never commit your `.env` file to version control

**Start the Backend Server:**

```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

**Configure Environment Variables:**

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

**Start the Frontend Development Server:**

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
SlotSwapper/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Event.js               # Event schema
│   │   └── SwapRequest.js         # Swap request schema
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   ├── events.js              # Event management routes
│   │   └── swaps.js               # Swap request routes
│   ├── utils/
│   │   └── auth.js                # JWT utilities
│   ├── server.js                  # Express server setup
│   ├── socket.js                  # Socket.IO configuration
│   ├── .env.example               # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/              # Login & Signup
│   │   │   ├── Dashboard/         # User dashboard
│   │   │   ├── Marketplace/       # Browse slots
│   │   │   ├── Requests/          # Manage requests
│   │   │   ├── Layout/            # App layout
│   │   │   └── common/            # Shared components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state management
│   │   │   └── SocketContext.jsx  # WebSocket management
│   │   ├── api/
│   │   │   └── index.js           # API client
│   │   ├── utils/
│   │   │   └── dateUtils.js       # Date formatting
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   ├── .env.example               # Environment template
│   └── package.json
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Event Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get user's events | Yes |
| POST | `/api/events` | Create new event | Yes |
| PATCH | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |

### Swap Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swaps/marketplace` | Get available slots | Yes |
| POST | `/api/swaps/request` | Create swap request | Yes |
| GET | `/api/swaps/incoming` | Get incoming requests | Yes |
| GET | `/api/swaps/outgoing` | Get outgoing requests | Yes |
| PATCH | `/api/swaps/:id/accept` | Accept swap request | Yes |
| PATCH | `/api/swaps/:id/reject` | Reject swap request | Yes |

### WebSocket Events

- `swap-request` - New swap request received
- `swap-accepted` - Swap request accepted
- `swap-rejected` - Swap request rejected

## 🔐 Environment Variables

### Backend Configuration

| Variable | Description | Example |
|----------|-------------|----------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/slotswapper` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend Configuration

| Variable | Description | Example |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000/api` |

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend linting
cd frontend
npm run lint
```

## 📦 Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

The optimized production build will be in the `frontend/dist` directory.

### Backend Production

```bash
cd backend
NODE_ENV=production npm start
```

## 🚀 Deployment

### Frontend (Netlify)

The frontend is configured for Netlify deployment with `netlify.toml`.

```bash
cd frontend
npm run build
# Deploy dist folder to Netlify
```

### Backend (Heroku/Railway)

The backend includes a `Procfile` for easy deployment.

```bash
cd backend
git push heroku main
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🐛 Known Issues

- None at the moment

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 👥 Authors

- **Tanmay** - [@tanmay34567](https://github.com/tanmay34567)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- MongoDB team for the flexible database
- Socket.IO for real-time communication
- Tailwind CSS for the utility-first styling approach
- All open-source contributors

## 📧 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Mobile app (React Native)
- [ ] Advanced filtering and search
- [ ] User ratings and reviews
- [ ] Recurring events support
- [ ] Multi-language support

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

Made with ❤️ by the SlotSwapper Team