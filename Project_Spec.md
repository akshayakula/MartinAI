MartinAI - Maritime AIS Threat Detection System MVP

Overview

MartinAI is a real-time AIS-based maritime threat detection system that:
	•	Monitors vessel movements inside a defined geofence
	•	Detects anomalies such as AIS shutoff or deviation from route
	•	Sends SMS alerts to nearby vessels or coast guards
	•	Includes a chat-based AI agent interface for querying vessel status and triggering actions

⸻

Tech Stack

Layer	Tool / Lib
Frontend	React + ShadCN + React-Leaflet
Backend	Node.js + Express.js
Geo Analysis	Turf.js
Alerting	Twilio API
AI Agent	Botpress / LangChain
Data Source	VesselFinder AIS API
Hosting	Vercel (Frontend) + Render/Fly.io



⸻

Core Features
	1.	Geofence Drawing & Persistence
	2.	Real-time AIS Data Ingestion
	3.	Deviation Detection Logic
	4.	AIS Shutoff Detection
	5.	Twilio SMS Notifications
	6.	AI Agent Chat Interface
	7.	Feedback loop on anomaly accuracy

⸻

Step-by-Step Build Plan

1. Geofence Drawing UI
	•	Use React-Leaflet with Leaflet.Draw plugin
	•	Save drawn polygon to local state, then persist to backend

const onDrawCreate = (e) => {
  const shape = e.layer.toGeoJSON();
  saveToBackend(shape);
}



⸻

2. Real-time AIS Data Ingestion
	•	Use VesselFinder LiveData API
	•	Pull every 30 seconds for vessels in bounding box

API Example:

GET https://api.vesselfinder.com/vessels?userkey=API_KEY&bbox=lat1,lon1,lat2,lon2&format=json

Sample Response:

[
  {
    "mmsi": "123456789",
    "lat": 38.8895,
    "lon": -77.0353,
    "course": 60,
    "speed": 12.4,
    "destination": "PORT ABC",
    "eta": "2025-04-01T12:00:00Z"
  }
]



⸻

3. Route Deviation Detection
	•	Use historical route data or voyage destination
	•	Compare real-time vessel coordinates with intended path using Turf.js

const dist = turf.pointToLineDistance(vesselPoint, intendedLine, { units: 'nauticalmiles' });
if (dist > 5) triggerAlert();



⸻

4. AIS Shutoff Detection
	•	Cache vessel presence in last N polling intervals
	•	If a vessel disappears unexpectedly from the zone → flag as anomaly

if (wasPresentLastPoll && notInCurrentPoll) {
  triggerAISAlert(mmsi);
}



⸻

5. Twilio SMS Notifications
	•	Trigger alerts for anomalies via Twilio

Twilio API Call:

POST https://api.twilio.com/2010-04-01/Accounts/{AccountSID}/Messages.json

Body:
{
  "To": "+1234567890",
  "From": "+1987654321",
  "Body": "ALERT: Vessel MMSI 123456789 veered off-course or went dark."
}



⸻

6. AI Agent Chat Interface
	•	Use Botpress or LangChain
	•	Integrate a natural language interface for status queries and actions

Example Capabilities:
	•	“Where is vessel X?”
	•	“Which vessels shut off AIS in the last hour?”
	•	“Send alert to ships near zone Y”

agent.run("Check if any vessel turned off AIS near Nigeria in the last 2 hours")



⸻

7. Feedback Loop
	•	Allow user to validate or dismiss alerts
	•	Store results to improve logic over time

{
  "mmsi": "123456789",
  "anomaly_type": "AIS_Shutoff",
  "confirmed": true,
  "timestamp": "2025-03-29T10:30:00Z"
}



⸻

Testing Plan
	•	Simulate vessel data streams
	•	Validate route and shutoff detection logic
	•	Test Twilio sandbox messaging
	•	Unit test AI agent prompts and workflows

⸻

Sample Prompts for Agent
	•	“Summarize last 5 anomalies”
	•	“Notify all ships within Gulf of Guinea”
	•	“Give ETA for vessel MMSI 123456789”
	•	“Who entered the restricted zone in the last 12 hours?”

⸻

Directory Structure

/client
  └── src/
      ├── components/
      ├── pages/
      ├── agent/
      └── map/

/server
  ├── routes/
  ├── ai/
  ├── utils/
  └── services/
      ├── twilio.js
      ├── vfinder.js
      └── anomaly.js



⸻

Environment Variables

VESSELFINDER_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
OPENAI_API_KEY=



⸻

Deployment Plan

Component	Platform
Frontend	Vercel
Backend API	Fly.io / Render
Database	Supabase / Mongo Atlas
Background Jobs	Railway / Render Jobs

---