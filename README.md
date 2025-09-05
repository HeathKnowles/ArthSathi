# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# ArthSathi App

A cross-platform finance learning and trading simulation app powered by React Native, Expo, Node.js, and Mistral AI.

## Features
- Learn Tab: Chat with an agentic RAG-powered assistant over indexed PDFs
- Trade Tab: Simulate buying/selling stocks with virtual portfolio
- Fast semantic search using local JSON and cosine similarity
- Backend powered by Mistral AI for embeddings and completions

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Expo Go app (for running on mobile)
- Mistral AI API key

### 2. Clone the Repository
```sh
git clone https://github.com/yourusername/arthsathi.git
cd arthsathi
```

### 3. Install Dependencies
```sh
npm install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory:
```
MISTRAL_API_KEY=your_mistral_api_key_here
```

Or set the variable in your shell before running the backend:
- **PowerShell:**
  ```sh
  $env:MISTRAL_API_KEY="your_mistral_api_key_here"
  ```
- **Bash:**
  ```sh
  export MISTRAL_API_KEY=your_mistral_api_key_here
  ```

### 5. Running the Backend
```sh
npx ts-node backend/server.ts
```

### 6. Running the Frontend (Expo)
```sh
npx expo start
```
- Scan the QR code with Expo Go app on your mobile device
- Make sure your device is on the same Wi-Fi network as your computer

### 7. Installing Expo Go
- Download Expo Go from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) or [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## Data Files

- `backend/embeddings.json` and PDF files in `backend/pdfs/` are excluded from version control.
- To generate `embeddings.json`, place your PDFs in `backend/pdfs/` and run the indexing script:

```sh
npx ts-node backend/index_pdfs.ts
```

This will process all PDFs and create the embeddings file needed for semantic search.

---

## Environment Variables Example
```
MISTRAL_API_KEY=your_mistral_api_key_here
```

---

## .gitignore Example
Add the following to your `.gitignore`:
```
# Node modules
node_modules/

# Environment files
.env

# Expo/React Native
.expo/
.expo-shared/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
```

---

## Troubleshooting
- If the frontend cannot connect to the backend, ensure both are running and your device is on the same network.
- If you see 'No answer' in chat, check backend logs for context and Mistral API response.
- For ES module errors, ensure you use `import` instead of `require` in backend code.

---

## License
MIT
