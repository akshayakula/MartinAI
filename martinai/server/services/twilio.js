const twilio = require('twilio');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client;

// Initialize Twilio client if credentials are available
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * Send SMS alert using Twilio
 * @param {string} to - Recipient phone number
 * @param {string} body - Message body
 * @returns {Promise<Object>} - Message response
 */
async function sendSms(to, body) {
  if (!client) {
    throw new Error('Twilio client not initialized - missing credentials');
  }

  if (!twilioPhoneNumber) {
    throw new Error('Twilio phone number not defined');
  }

  try {
    const message = await client.messages.create({
      body,
      to,
      from: twilioPhoneNumber
    });

    console.log(`SMS sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

/**
 * Send anomaly alert SMS
 * @param {Object} anomaly - Anomaly object
 * @param {string} phoneNumber - Recipient phone number
 * @returns {Promise<Object>} - Message response
 */
async function sendAnomalyAlert(anomaly, phoneNumber) {
  let message = '';

  switch (anomaly.anomalyType) {
    case 'AIS_SHUTOFF':
      message = `ALERT: Vessel ${anomaly.vesselName || anomaly.mmsi} has gone dark (AIS shutoff) at ${anomaly.location.lat.toFixed(4)}, ${anomaly.location.lon.toFixed(4)}. Last seen at ${new Date(anomaly.details.lastSeen).toISOString()}.`;
      break;
    case 'ROUTE_DEVIATION':
      message = `ALERT: Vessel ${anomaly.vesselName || anomaly.mmsi} has deviated from its route by ${anomaly.details.deviationDistance.toFixed(2)} nautical miles at ${anomaly.location.lat.toFixed(4)}, ${anomaly.location.lon.toFixed(4)}.`;
      break;
    case 'GEOFENCE_VIOLATION':
      message = `ALERT: Vessel ${anomaly.vesselName || anomaly.mmsi} has violated geofence "${anomaly.details.geofenceName}" at ${anomaly.location.lat.toFixed(4)}, ${anomaly.location.lon.toFixed(4)}.`;
      break;
    default:
      message = `ALERT: Vessel ${anomaly.vesselName || anomaly.mmsi} has triggered an anomaly of type ${anomaly.anomalyType} at ${anomaly.location.lat.toFixed(4)}, ${anomaly.location.lon.toFixed(4)}.`;
  }

  return sendSms(phoneNumber, message);
}

module.exports = {
  sendSms,
  sendAnomalyAlert
}; 