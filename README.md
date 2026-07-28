# Way Finder — AI Travel Planner

Way Finder is an intelligent, modern trip planning application that instantly generates customized travel itineraries and locates real, famous landmarks using Groq AI.

## Features

- **Flash Plan AI**: Type a destination and instantly get a full itinerary with geocoded coordinates.
- **Interactive 3D Carousel**: Stunning UI with dynamic locations on the home screen.
- **Smart Itinerary**: View days, stops, categories (Food, Stay, Photo, Explore), and beautiful imagery.
- **Interactive Map Route**: Real-time Leaflet map tracing the journey across your trip stops.
- **Extra Places Studio**: Browse nearby hidden gems visually.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Lucide Icons, React-Leaflet
- **Backend / AI Proxy**: Node.js, Express, Groq Llama-3.3-70b

## Running Locally

To run the full application (frontend + Express proxy server) locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/balaji490/Trip-Planner.git
   cd Trip-Planner
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set your API Key**
   Create a `.env` file in the root directory and add your Groq API Key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the Application**
   This will build the React app and start the Express server on port 3001.
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001` to use the app!

## Deployment

This app is configured to be easily deployed on **Render** as a Web Service:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- Remember to add your `GROQ_API_KEY` in the Environment Variables section on Render.
