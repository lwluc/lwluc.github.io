# lwluc

I am trying to combine features i like from other websites and interesting technologies to my small website.

## 🎮 Tic-Tac-Toe Gatekeeper

This website features a **Tic-Tac-Toe game** as a gatekeeper. To access the main content, you must either:
- **Win the game** against the AI, or
- **Bypass it** by opening the browser console and typing `skipGame()`.

## 🚀 Local Development

To test the website locally, start a static server to avoid CORS issues with ES6 modules:

```bash
cd /workspace/lwluc__lwluc.github.io
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Alternative Servers

| Method | Command | Notes |
|--------|---------|-------|
| **Python 3** | `python3 -m http.server 8000` | Built-in, no dependencies |
| **Node.js** | `npx http-server -p 8000` | Requires `http-server` (`npm install -g http-server`) |
| **PHP** | `php -S localhost:8000` | Built-in if PHP is installed |
| **VS Code** | Right-click `index.html` → "Open with Live Server" | Requires [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) |

### Testing Checklist

- [ ] Open [http://localhost:8000](http://localhost:8000) → Should redirect to Tic-Tac-Toe game
- [ ] Play the game → Win, lose, or tie to test all outcomes
- [ ] Open console (`F12` → Console) and type `skipGame()` → Should bypass the game
- [ ] Check for errors in the console (none expected)

## 📁 Project Structure

```
.
├── index.html              # Main page (protected by Tic-Tac-Toe)
├── tic-tac-toe.html        # Tic-Tac-Toe game page
├── privacy-policy.html     # Privacy policy (German)
├── README.md               # This file
├── css/
│   ├── style.css           # Main styles
│   ├── toggle.css          # Toggle switch styles
│   └── tic-tac-toe/
│       └── TicTacToe.css    # Game-specific styles
├── img/                    # Favicons and images
└── js/
    ├── protector.js        # Gatekeeper logic (redirects to game)
    ├── features.js         # Additional features (scroll progress, modal)
    └── privacy-policy.js   # Privacy policy page logic
    └── tic-tac-toe/
        ├── logger.js       # Debug logging utility
        ├── game_state.js   # Game state management
        ├── ai.js           # AI logic (Minimax algorithm)
        ├── ui.js           # UI rendering utilities
        └── script.js       # Main game script
```

## 🛠️ Technologies Used

- **Vanilla JavaScript** (ES6 Modules)
- **HTML5 & CSS3**
- **Minimax Algorithm** for AI opponent
- **GitHub Pages** for hosting

## 🤝 Contributing

Feel free to open issues or pull requests for improvements!
