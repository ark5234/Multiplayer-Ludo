# 🎲 Multipla## 🌟 What Makes This Special

This project extends the classic Ludo game with an innovative **real-time scoring system** that:

- 📊 Tracks player progress with live score updates
- ⚔️ Implements capture mechanics where attacking pawns steal points
- 🏆 Determines winners through multiple criteria (traditional completion + score-based)
- 🎯 Adds strategic depth while preserving classic Ludo rules
- 📱 Features a beautiful, responsive scoreboard with real-time updates

**PLUS Enhanced UX Features:**

- 🎯 **Clear Turn Indicators**: Always know whose turn it is with visual player status indicators
- 📊 **Real-Time Activity Feed**: Live updates showing all game events and player actions
- 🎮 **Enhanced Visual Feedback**: Smooth pawn animations and movement tracking
- 🏠 **Complete Room Management**: Create, delete rooms, and manage players with admin controls
- 👥 **Player Status Tracking**: See who's online, offline, and currently active
- 🔄 **Persistent Sessions**: 24-hour session duration with automatic reconnectionh Real-Time Scoring System

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

An enhanced multiplayer web-based implementation of the classic board game Ludo, built with the MERN stack and featuring a **unique real-time scoring system** that adds competitive depth while maintaining the traditional gameplay experience. Now with **comprehensive UX enhancements** including turn indicators, activity feed, room management, and enhanced visual feedback.

## 🌟 What Makes This Special

This project delivers a complete multiplayer Ludo experience with **comprehensive gameplay enhancements**:

- 🎯 **Clear Turn Indicators**: Always know whose turn it is with visual player status indicators
- 📊 **Real-Time Activity Feed**: Live updates showing all game events and player actions
- 🎮 **Enhanced Visual Feedback**: Smooth pawn animations and movement tracking
- � **Complete Room Management**: Create, delete rooms, and manage players with admin controls
- 👥 **Player Status Tracking**: See who's online, offline, and currently active
- ⚔️ **Capture Mechanics**: Strategic gameplay with pawn capturing and scoring
- 📱 **Responsive Design**: Optimized for all devices with modern UI/UX
- 🔄 **Persistent Sessions**: 24-hour session duration with automatic reconnection

## 🎮 Key Features

### 🎯 Enhanced Gameplay Experience

- **Turn Indicators**: Current player highlighted with 🎲 dice emoji and pulsing border animation
- **Activity Feed**: Real-time game activity showing moves, captures, dice rolls, and player status
- **Visual Feedback**: Pawn animations, movement tracking, and position highlighting
- **Player Status**: Clear online/offline indicators and turn-based status updates

### � Complete Room Management

- **Room Administration**: Create and delete game rooms with proper cleanup
- **Player Management**: Kick inactive players and monitor online status
- **Session Persistence**: 24-hour MongoDB sessions with automatic reconnection
- **Multi-room Support**: Multiple game rooms running simultaneously

### 🔥 Real-Time Scoring System

- **Pawn Progress Scoring**: Earn points equal to dice rolls when moving pawns
- **Capture Mechanics**: Attacking pawns steal all points from captured pawns
- **Live Score Tracking**: Real-time scoreboard updates via WebSocket
- **Multiple Win Conditions**: Traditional (all pawns home) + Score-based (highest points)

## 🎯 Scoring Rules

| Event | Scoring Rule | Example |
|-------|-------------|---------|
| **Pawn Movement** | `pawnScore += diceValue` | Roll 6 → Gain 6 points |
| **Capture Attack** | `attackerScore += victimScore`<br>`victimScore = 0` | Capture pawn with 20 points → Attacker gains 20 |
| **Player Total** | `playerScore = Σ(allPawnScores)` | 4 pawns: 10+15+20+5 = 50 points |
| **Winner** | Highest score when game ends | Leader: 75 points wins |

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose (recommended)
- MongoDB Atlas account (or local MongoDB)
- Git

### 🐳 Docker Installation (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/ark5234/Multiplayer-Ludo.git
   cd Multiplayer-Ludo
   ```

2. **Setup Environment**

   ```bash
   # Copy environment template
   cp .env.docker.example .env.docker
   
   # Edit .env.docker file and add your MongoDB connection string
   # CONNECTION_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```

3. **Run with Docker Compose**

   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Or run in background
   docker-compose up -d --build
   ```

4. **Access the game**

   - Game Application: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)

### 💻 Manual Installation

1. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

2. **Setup Environment**

   ```bash
   # Copy environment template
   cp backend/.env.example backend/.env
   
   # Edit .env file and add your MongoDB connection string
   ```

3. **Run the application**

   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm start
   
   # Terminal 2: Start frontend development server
   cd ..
   npm start
   ```

## 📁 Project Structure

```
Multiplayer-Ludo/
├── 📁 backend/
│   ├── 📁 handlers/          # Socket.IO event handlers (enhanced with activity tracking)
│   ├── 📁 models/            # MongoDB schemas (enhanced with scoring)
│   ├── 📁 services/          # Business logic & scoring service
│   ├── 📁 socket/            # WebSocket management
│   └── 📁 config/            # Database & session configuration
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 Navbar/
│   │   │   └── NameContainer/ # 🆕 Enhanced player status display
│   │   ├── 📁 GameActivity/  # 🆕 Real-time activity feed
│   │   ├── 📁 RoomManagement/ # 🆕 Complete room administration
│   │   ├── 📁 Scoreboard/    # 🆕 Live scoring display
│   │   ├── 📁 WinnerOverlay/ # 🆕 Enhanced winner screen
│   │   ├── 📁 Gameboard/     # Main game interface
│   │   └── 📁 ...           # Other game components
│   └── 📁 hooks/            # Custom React hooks
├── 📁 mongo-init/           # MongoDB initialization scripts
├── 📄 docker-compose.yml    # Multi-container orchestration
├── 📄 Dockerfile.frontend   # React app containerization
├── 📄 Dockerfile.backend    # Node.js API containerization
├── 📄 nginx.conf           # Frontend proxy configuration
├── 📄 SCORING_SYSTEM.md    # 🆕 Detailed implementation guide
└── 📄 README.md            # This comprehensive guide
```

## 🎨 Screenshots

### Live Scoreboard
The real-time scoreboard shows current standings, scores, and capture counts:
```
┌─────────────────────────┐
│       Live Scores       │
├─────────────────────────┤
│ 🔴 Red     👑  45 pts   │
│ 🔵 Blue       32 pts    │
│ 🟢 Green      28 pts    │
│ 🟡 Yellow     15 pts    │
├─────────────────────────┤
│ Updates in real-time    │
└─────────────────────────┘
```

### Winner Screen
Enhanced final standings with complete statistics and rankings.

## 🔧 Technical Implementation

### Backend Enhancements
- **Scoring Service**: Modular scoring logic separate from core game mechanics
- **Enhanced Models**: Pawn and Room models extended with scoring capabilities
- **Real-time Events**: New WebSocket events for score updates
- **Winner Logic**: Score-based winner determination with tie-breaking

### Frontend Components
- **Scoreboard Component**: Live score display with professional UI
- **Winner Overlay**: Complete final standings screen
- **Real-time Updates**: Automatic score refreshing via WebSocket events

## 🎯 Game Flow with Scoring

1. **Game Start**: All pawns begin with 0 points
2. **Movement**: Each pawn move adds dice value to pawn's score
3. **Captures**: Attacking pawn steals all points from captured pawn
4. **Real-time Updates**: Scoreboard updates instantly for all players
5. **Win Conditions**: 
   - Traditional: First player to get all 4 pawns home
   - Score-based: Highest total score when timer ends
6. **Final Screen**: Complete standings with statistics

## 📊 Performance & Scalability

- **Real-time Communication**: Optimized WebSocket events
- **Efficient Updates**: Only changed data is transmitted
- **Responsive UI**: Smooth animations without performance impact
- **Scalable Architecture**: Modular design supports easy feature additions

## 🛡 Technology Stack

- **Frontend**: React.js, CSS3, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: WebSocket communication
- **Session Management**: Express sessions with MongoDB store
- **Deployment**: Docker & Docker Compose
- **Development**: ESLint, Prettier, VS Code configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Original Ludo game implementation by [Wenszel](https://github.com/Wenszel/mern-ludo)
- Enhanced with real-time scoring system and comprehensive UX improvements
- Added turn indicators, activity feed, room management, and Docker deployment
- Built with modern MERN stack architecture and Socket.IO real-time communication

## 📧 Contact

- **Developer**: [ark5234](https://github.com/ark5234)
- **Repository**: [Multiplayer-Ludo](https://github.com/ark5234/Multiplayer-Ludo)
- **Issues**: [Report bugs or request features](https://github.com/ark5234/Multiplayer-Ludo/issues)

---

🎲 **Ready to play? Clone, setup, and enjoy the enhanced Ludo experience with real-time scoring!** 🎲

*Features: Real-time scoring • Turn indicators • Activity feed • Room management • Docker deployment*
