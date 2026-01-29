# Port Vision: AI-Powered Port Management System

## 🚀 Overview

**Port Vision** is a modern, proof-of-concept web application designed to revolutionize container yard management in shipping ports. It combines a real-time, interactive visualization of the container yard with powerful AI-driven tools to optimize logistics, improve efficiency, and provide operators with intelligent insights for better decision-making.

Built with Next.js and powered by Google's Gemini model through Genkit, Port Vision demonstrates how Generative AI can be applied to solve complex, real-world logistical challenges.

## ✨ Core Features

### 1. Real-time Yard Visualization
-   **Interactive Map:** Get a bird's-eye view of the entire container yard, with each slot clearly represented.
-   **Color-Coded Status:** Instantly identify the status of any slot:
    -   **Light Green:** Empty and available.
    -   **Light Blue:** Occupied with a standard container.
    -   **Light Red:** Occupied with a high-priority container.
-   **Detailed Tooltips:** Hover over any slot to get quick information about its ID, tier, and the container it holds.

### 2. AI-Powered Slot Suggestion
-   **Smart Placement:** When checking in a new container, the system uses an AI model to analyze all empty slots against multiple logistical factors.
-   **Data-Driven Recommendations:** The AI considers:
    -   Distance to the main gate.
    -   Blocking Index (how many containers are on top of it).
    -   Zone Congestion.
    -   Container size match.
-   **Explainable AI:** The system doesn't just give you a suggestion; it provides a detailed, human-readable explanation of *why* it's the optimal choice.
-   **Dynamic Weight Adjustment:** Operators can use sliders to dynamically change the importance of each factor, allowing the AI to provide tailored suggestions based on current operational priorities.

### 3. Predictive ETA & Timeline
-   **AI-Driven ETA Prediction:** As soon as a container is checked in, the AI automatically predicts its Estimated Time of Departure (ETA) based on its cargo type, priority, and size.
-   **Complete Event Timeline:** Click on any container to see a detailed, chronological log of its journey through the yard, from check-in and ETA prediction to its final slot assignment.

### 4. Advanced Yard Simulation
-   **"What-If" Analysis:** A powerful tool for port planners. Simulate the impact of adding a specified number of new containers with a defined mix of sizes, cargo types, and priorities.
-   **Predictive Insights:** The simulation generates:
    -   A **Congestion Heatmap** to visualize potential bottlenecks.
    -   An **Estimated Relocation Count**, predicting how many existing containers would need to be moved.

## 🛠️ Tech Stack

-   **Framework:** Next.js (App Router, Server Actions)
-   **Language:** TypeScript
-   **AI Integration:** Google Gemini via Genkit
-   **UI Components:** ShadCN UI
-   **Styling:** Tailwind CSS
-   **State Management:** React Context API

## Getting Started

This is a Next.js project.

First, install the dependencies:
```bash
npm install
```

Next, create a `.env` file in the root of the project and add your Google Gemini API Key:
```
GEMINI_API_KEY=your_api_key_here
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
