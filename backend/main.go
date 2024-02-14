package main

import (
	"math/rand"
	"time"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

var (
    redisClient *redis.Client
)

func main() {
    // Initialize Redis client
    redisClient = redis.NewClient(&redis.Options{
        Addr:     "localhost:6379",
        Password: "", // no password set
        DB:       0,  // use default DB
    })

    
    router := gin.Default()
    router.Use(cors.Default())

    
    router.POST("/start-game", startGame)
    router.POST("/draw-card", drawCard)
    router.POST("/save-game", saveGame)
    router.GET("/leaderboard", getLeaderboard)

    // Start server
    router.Run(":8080")
}

func startGame(c *gin.Context) {
    // Main 5 cards
    mainCards := []string{"KITTEN", "DIFFUSE", "SHUFFLE", "KITTEN", "EXPLODE"}

    // Shuffle the main cards
    shuffleDeck(mainCards)

    // Randomly select cards from the shuffled main cards
    numCards := 5 // Number of cards to select
    selectedCards := make([]string, numCards)
    rand.Seed(time.Now().UnixNano()) // Seed the random number generator
    for i := 0; i < numCards; i++ {
        randomIndex := rand.Intn(len(mainCards))
        selectedCards[i] = mainCards[randomIndex]
    }

    // Save the shuffled deck to Redis
    err := redisClient.Del(c, "deck").Err()
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    for _, card := range selectedCards {
        err := redisClient.LPush(c, "deck", card).Err()
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
    }

    // Initialize user's game state
    err = redisClient.Set(c, "game_state", "started", 0).Err()
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    
    // Return the shuffled deck
    c.JSON(200, gin.H{"message": "Game started successfully!", "deck": selectedCards})
}


func drawCard(c *gin.Context) {
    // Check if the game has been started
    gameState, err := redisClient.Get(c, "game_state").Result()
    if err != nil {
        c.JSON(500, gin.H{"error": "Game state not found"})
        return
    }
    if gameState != "started" {
        c.JSON(400, gin.H{"error": "Game not started yet"})
        return
    }

    // Draw a card from the deck
    card, err := redisClient.LPop(c, "deck").Result()
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to draw card"})
        return
    }

    // Check the drawn card type
   switch card {
case "KITTEN":
    c.JSON(200, gin.H{"message": "You drew a cat card 😼", "card": "KITTEN"})
case "EXPLODE":
    c.JSON(200, gin.H{"message": "Game over! You drew an exploding kitten 💣", "card": "EXPLODE"})
case "DIFFUSE":
    c.JSON(200, gin.H{"message": "You drew a defuse card 🙅‍♂️", "card": "DIFFUSE"})
case "SHUFFLE":
    c.JSON(200, gin.H{"message": "You drew a shuffle card 🔀", "card": "SHUFFLE"})
default:
    c.JSON(200, gin.H{"message": "Unknown card", "card": "UNKNOWN"})
}

}

func saveGame(c *gin.Context) {
    // Get the current game state
    gameState, err := redisClient.Get(c, "game_state").Result()
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to retrieve game state"})
        return
    }

    // Get the user's username and score from the request body
    var user struct {
        Username string `json:"username"`
        Score    int    `json:"score"`
    }
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(400, gin.H{"error": "Invalid request body"})
        return
    }

    // Save the game state to Redis or your database
    err = redisClient.Set(c, "saved_game_state", gameState, 0).Err()
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to save game state"})
        return
    }

    // Update leaderboard with user's username and score
    err = redisClient.Set(c, "user:"+user.Username, user.Score, 0).Err()
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to update leaderboard"})
        return
    }

    c.JSON(200, gin.H{"message": "Game state saved successfully"})
}


func getLeaderboard(c *gin.Context) {
    // Retrieve leaderboard data from Redis
    keys, err := redisClient.Keys(c, "user:*").Result()
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to retrieve leaderboard data"})
        return
    }

    leaderboard := make(map[string]int)
    for _, key := range keys {
        username := key[5:] // Remove "user:" prefix
        score, err := redisClient.Get(c, key).Int()
        if err != nil {
            c.JSON(500, gin.H{"error": "Failed to retrieve user score"})
            return
        }
        leaderboard[username] = score
    }

    c.JSON(200, leaderboard)
}

func shuffleDeck(cards []string) {
    rand.Seed(time.Now().UnixNano())
    rand.Shuffle(len(cards), func(i, j int) {
        cards[i], cards[j] = cards[j], cards[i]
    })
}
