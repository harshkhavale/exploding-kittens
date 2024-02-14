package main

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	// Create a new Fiber app
	app := fiber.New()

	// Enable CORS with default options
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "*",
	}))


	// Enable CORS
	app.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		return c.Next()
	})

	// Define routes
	app.Post("/start-game", startGame)
	app.Post("/draw-card", drawCard)
	app.Post("/save-game", saveGame)
	app.Get("/leaderboard", getLeaderboard)
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to the homepage!")
	})

	// Start the server
	err := app.Listen(":8080")
	if err != nil {
		fmt.Println("Error:", err)
	}
}

func startGame(c *fiber.Ctx) error {
	// Generate a new deck of cards
	cards := []string{"KITTEN", "DIFFUSE", "SHUFFLE", "KITTEN", "EXPLODE"} // Four cats and one bomb
	shuffleDeck(cards)

	// Save the shuffled deck to Redis
	err := redisClient.Del(c.Context(), "deck").Err()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	for _, card := range cards {
		err := redisClient.LPush(c.Context(), "deck", card).Err()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
	}

	// Initialize user's game state
	err = redisClient.Set(c.Context(), "game_state", "started", 0).Err()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Return the shuffled deck
	return c.JSON(fiber.Map{"message": "Game started successfully!", "deck": cards})
}

func drawCard(c *fiber.Ctx) error {
	// Check if the game has been started
	gameState, err := redisClient.Get(c.Context(), "game_state").Result()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Game state not found"})
	}
	if gameState != "started" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Game not started yet"})
	}

	// Draw a card from the deck
	card, err := redisClient.LPop(c.Context(), "deck").Result()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to draw card"})
	}

	// Check the drawn card type
	switch card {
	case "KITTEN":
		return c.JSON(fiber.Map{"message": "You drew a cat card 😼", "card": "KITTEN"})
	case "EXPLODE":
		return c.JSON(fiber.Map{"message": "Game over! You drew an exploding kitten 💣", "card": "EXPLODE"})
	case "DIFFUSE":
		return c.JSON(fiber.Map{"message": "You drew a defuse card 🙅‍♂️", "card": "DIFFUSE"})
	case "SHUFFLE":
		return c.JSON(fiber.Map{"message": "You drew a shuffle card 🔀", "card": "SHUFFLE"})
	default:
		return c.JSON(fiber.Map{"message": "Unknown card", "card": "UNKNOWN"})
	}
}

func saveGame(c *fiber.Ctx) error {
	// Get the current game state
	gameState, err := redisClient.Get(c.Context(), "game_state").Result()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve game state"})
	}

	// Save the game state to Redis or your database
	err = redisClient.Set(c.Context(), "saved_game_state", gameState, 0).Err()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save game state"})
	}

	return c.JSON(fiber.Map{"message": "Game state saved successfully"})
}

func getLeaderboard(c *fiber.Ctx) error {
	// Retrieve leaderboard data from Redis
	keys, err := redisClient.Keys(c.Context(), "user:*").Result()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve leaderboard data"})
	}

	leaderboard := make(map[string]int)
	for _, key := range keys {
		username := key[5:] // Remove "user:" prefix
		score, err := redisClient.Get(c.Context(), key).Int()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user score"})
		}
		leaderboard[username] = score
	}

	return c.JSON(fiber.Map{"leaderboard": leaderboard})
}

func shuffleDeck(cards []string) {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(cards), func(i, j int) {
		cards[i], cards[j] = cards[j], cards[i]
	})
}
