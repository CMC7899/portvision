# **App Name**: Port Vision

## Core Features:

- Container Check-in: Allows operators to input container details such as size, cargo type, and priority, automatically assigning an arrival timestamp.
- ETA Prediction: Cloud Function predicts the estimated time of departure (ETA) based on container attributes (arrival time, cargo type, priority, size) using a rule-based system.
- Slot Suggestion: Cloud Function automatically suggests optimal slot assignments based on a scoring system that considers distance to gate, blocking index, size match, and zone congestion. Allows manual override.
- Real-time Yard Map: Displays a real-time yard map visualizing container positions, status (empty, reserved, occupied), and priority. Reflects updates immediately after check-in or relocation.
- Container Detail Timeline: Provides a detailed timeline for each container, tracking check-in, predicted ETA, proposed slot, assigned slot, moves, and departure.
- Simulation Mode: Simulates the addition of a specified number of containers with a defined mix of sizes, cargo types, and priorities. Generates a congestion heatmap and estimates the number of relocations that would occur.
- Scoring Weights Adjustment: Allows admin users to adjust scoring weights via sliders, then observe updated results.
- Automatic Data Seeding: Automatically seeds initial data and stores it in the database. The system is also able to save data with a real database.

## Style Guidelines:

- Primary color: HSL(195, 70%, 40%) - A muted cyan (#2096BA), referencing the sea and maritime environments typical of a port.
- Background color: HSL(195, 20%, 95%) - A very light tint of cyan (#F0F8FA), provides a soft and unobtrusive backdrop.
- Accent color: HSL(165, 50%, 45%) - A complementary, vibrant teal (#3AB5A7) to highlight interactive elements.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text. Using 'Space Grotesk' for the headings provides a modern, slightly tech-oriented look, while 'Inter' ensures readability for longer texts and descriptions.
- Use clear and simple icons to represent container types, priority levels, and status indicators. Consistent iconography aids in quick recognition and understanding on the Yard Map.
- Yard Map uses a grid-based layout to visualize slot arrangements. Color-code slots based on status: #E0F2F1 for empty, #FFF3E0 for reserved, #E3F2FD for occupied-normal, #FFEBEE for occupied-high.
- Incorporate subtle transitions when updating the Yard Map or displaying container information. Animated transitions should be brief and functional to avoid distracting the user.