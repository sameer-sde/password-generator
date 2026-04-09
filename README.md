# PassForge Pro 🔐✨

PassForge Pro is a modern, single–page password, PIN, and passphrase generator with an animated cyber‑style UI and built‑in strength analysis.

🔗 **Live Demo:** https://sameer-sde.github.io/password-generator/ 


---

## 🚀 Features

- 🔑 Generate strong random passwords with customizable:
  - 📏 Length slider.
  - 🔤 Character sets (uppercase, lowercase, numbers, symbols, extended symbols).
- 🧠 Pronounceable password mode for more memorable but still strong passwords.
- 🧱 Enforce rules like:
  - 🚫 No ambiguous characters (0/O, 1/I, etc.).
  - 🔠 Must start with a letter.
- 📊 Live strength meter showing:
  - 🔢 Entropy in bits.
  - 🏷️ Text label from “very weak” to “fortress 🏰”.
  - ✅ Checklist (length, cases, number, symbol, no triple repeats).
- 🔐 PIN generator:
  - 📏 Configurable length.
  - 🔡 Numeric or alphanumeric mode.
- 🧩 Passphrase generator:
  - 🧮 Configurable word count.
  - ➖ Custom separators (dash, space, etc.).
  - ⚙️ Optional leetspeak / transformations.
- 🧪 Password analyzer:
  - 📋 Paste any password to see strength and checks instantly.
- 🕒 History panel showing the last 8 generated passwords with quick copy.
- 🌌 Fully responsive glassmorphism UI with:
  - 🎆 Animated background canvas.
  - 📂 Tabbed navigation (Password / PIN / Passphrase / Analyze).

---

## 🛠️ Tech Stack

- **HTML5** – Structure and layout of the single‑page app.
- **CSS3** – Custom glassmorphism UI, gradients, neon accents, sliders, tabs, and strength meter styling.
- **Vanilla JavaScript** – Secure randomness, entropy calculation, password/PIN/passphrase logic, history, copy‑to‑clipboard, and UI state management.

---

## 📦 Getting Started

### ✅ Prerequisites

- Any modern browser (Chrome, Firefox, Edge, Safari) with JavaScript enabled.

### 🖥️ Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```
2. Open `index.html` directly in your browser  

   **or** use a simple dev server:
   ```bash
   # Python 3
   python -m http.server 8000
   # then open http://localhost:8000 in your browser
   ```

No build step or backend is required; it is a pure front‑end project.

---

## 💡 Usage

- **🛡️ Password tab**
  - Adjust the length slider to your desired length.
  - Toggle character set chips to include/exclude uppercase, lowercase, numbers, symbols, etc.
  - Click **Generate** to create a password.
  - Click the password box to copy it; the strength meter updates instantly.

- **🔢 PIN tab**
  - Choose length and type (numeric / alphanumeric).
  - Generate and copy your PIN for quick use.

- **🧾 Passphrase tab**
  - Select word count and separator (e.g., dash, space).
  - Generate a multi‑word passphrase; optionally enable extra transformations like leetspeak if available.

- **🧪 Analyze tab**
  - Paste any existing password.
  - View entropy in bits, a strength label, and requirement checks (length, cases, numbers, symbols, repeated characters).

---

## 📁 Folder Structure

```text
.
├── index.html   # Main HTML page and layout
├── style.css    # Global styles, animations, and responsive design
└── script.js    # Password/PIN/passphrase logic, strength analysis, UI behavior
```

---

## 🔮 Future Improvements

- 💾 Export/import user settings (preferred length, modes, options).
- 🌗 Dark/light theme toggle on top of the current neon style.
- 📥 Option to download history as a text file (not recommended for real secrets).
- 🌍 Localization of UI text to multiple languages.

---

## 📜 License

This project is licensed under the **MIT License**, which allows others to use, modify, and distribute your project (including commercially) as long as they include your copyright and the license.

Create a `LICENSE` file in the repository and choose the **MIT** template from GitHub’s license picker.
