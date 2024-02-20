# Exploding Kitten Game 🐱💣
![screencapture-exploding-kittens-alpha-vercel-app-2024-02-20-12_25_57](https://github.com/harshkhavale/exploding-kittens/assets/91471322/38b35441-6fba-4f9e-99c6-804d84cb7a34)

## Introduction

Welcome to the Exploding Kitten web-based single-player card game! This project utilizes React with Redux for the frontend, Golang for the backend, and Redis for database storage. The objective is to draw cards from the deck, avoiding exploding kittens while collecting points to climb the leaderboard.

## Features 🚀

- Draw random cards from the deck 🃏
- Create a username to enter the game 👤
- Leaderboard to track user wins 🏆
- Backend powered by Golang, utilizing Redis for data storage 🛠️
- Real-time updates for leaderboard points 🔄
- Automatic game saving for user progress 💾

🔃. **Try the Game:**

```bash
https://exploding-kittens-alpha.vercel.app/
```

## Installation 🛠️

1. **Clone the repository:**

```bash
git clone https://github.com/harshkhavale/exploding-kittens
```

2. **Navigate to the project directory:**

```bash
cd exploding-kitten-game
```

3. **Install dependencies for frontend and backend:**

```bash
cd client
npm install
cd backend
go mod tidy
```

4. **Setup Redis:**

Ensure Redis is installed and running on your system. If not, refer to the [Redis documentation](https://redis.io/download) for installation instructions.

5. **Configure environment variables:**

Create a `.env` file in the `backend` directory and set the following variables:

```plaintext
REDIS_ADDR=localhost:6379
REDIS_DB=0
```

6. **Run the application:**

```bash
cd ../frontend
npm start
```

```bash
cd ../backend
go run main.go
```

## Assumptions 🤔

- User authentication is not implemented for simplicity.
- Real-time updates are achieved through WebSocket integration.
- Game state saving relies on local storage.

## Contributing 🙌

Contributions are welcome! Feel free to open issues or pull requests.

---

Feel free to customize this README further based on your project's specific needs and preferences.
