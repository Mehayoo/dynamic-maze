# Dynamic Maze Game

This Maze Game is a dynamic, browser-based project developed using TypeScript. It serves as an exploration of Object-Oriented Programming (OOP) principles and advanced JavaScript functionalities, with a focus on decoupling components to allow for flexibility and extendibility.

## Key Design Patterns and Concepts

-   **Dynamic Maze Generation Using Recursion**: This approach allows the creation of a new, unique maze layout each time the game is played, adding to the challenge and replayability. It is employed to carve out paths and create a complex labyrinth from a simple grid structure, ensuring that each gameplay experience is distinct and engaging.
-   **Singleton Pattern**: Used in the Game class to ensure only one instance of the game is running.
-   **Observer Pattern**: Implemented for event handling, allowing objects to subscribe and listen for specific events.
-   **Mediator Pattern**: The Game class functions as a mediator, orchestrating interactions between different components.
-   **Decoupling**: Strategic separation of concerns allows components to be easily extended or replaced.
-   **MVC-like Architecture**: While not a classical MVC, the project employs a similar separation of concerns, enhancing maintainability and scalability.

## Note

This project is designed for educational and reference purposes. It showcases the application of design patterns in a practical context, demonstrating how even a simple game can be architecturally complex and thoughtfully structured. However, it is the intellectual property of Mihaiu Sorin-Ionut. For more information on permissible use, please refer to the LICENSE file in this repository.
