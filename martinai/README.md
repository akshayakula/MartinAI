# MartinAI - Maritime AIS Threat Detection System

MartinAI is a real-time AIS-based maritime threat detection system that monitors vessel movements, detects anomalies, and sends alerts.

## Features

- **Geofence Drawing & Persistence**: Draw custom geofences to monitor specific maritime areas
- **Real-time AIS Data Ingestion**: Pull vessel data from VesselFinder API
- **Deviation Detection**: Detect when vessels deviate from their expected routes
- **AIS Shutoff Detection**: Identify when vessels unexpectedly go dark
- **SMS Notifications**: Send alerts via Twilio when anomalies are detected
- **AI Agent Interface**: Query vessel status and take actions through a chat interface

## Tech Stack

### Frontend
- React.js
- React Router
- Leaflet Maps with drawing tools
- Tailwind CSS

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- LangChain for AI agent
- Turf.js for geospatial analysis

### Integrations
- VesselFinder API for AIS data
- Twilio for SMS alerts
- OpenAI API for AI agent

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- API keys for VesselFinder, Twilio, and OpenAI

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/martinai.git
cd martinai
```

2. Install server dependencies
```
cd server
npm install
```

3. Install client dependencies
```
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/martinai
VESSELFINDER_API_KEY=your_vesselfinder_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
OPENAI_API_KEY=your_openai_api_key
```

5. Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server
```
cd server
npm run dev
```

2. Start the frontend client
```
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Create Geofences**: Navigate to the Map page and use the drawing tools to create geofences.
2. **Monitor Vessels**: Check the Vessels page to see all vessels being tracked.
3. **Review Anomalies**: The Anomalies page shows all detected issues with vessels.
4. **Chat with AI Agent**: Use the Chat page to ask questions and request actions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- VesselFinder for providing AIS data
- Twilio for SMS API
- OpenAI for the LLM API 