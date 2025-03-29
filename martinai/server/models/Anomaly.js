const memoryStore = require('../services/memoryStore');

/**
 * Anomaly model using in-memory store instead of Mongoose
 */
class Anomaly {
  /**
   * Find anomalies based on criteria
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} - Array of anomalies
   */
  static find(filter = {}, options = {}) {
    return Promise.resolve(memoryStore.find('anomalies', filter, options));
  }
  
  /**
   * Find one anomaly
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object|null>} - Anomaly or null
   */
  static findOne(filter = {}) {
    return Promise.resolve(memoryStore.findOne('anomalies', filter));
  }
  
  /**
   * Find anomaly by ID
   * @param {string} id - Anomaly ID
   * @returns {Promise<Object|null>} - Anomaly or null
   */
  static findById(id) {
    return Promise.resolve(memoryStore.findOne('anomalies', { _id: id }));
  }
  
  /**
   * Count anomalies
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} - Count
   */
  static countDocuments(filter = {}) {
    return Promise.resolve(memoryStore.countDocuments('anomalies', filter));
  }
  
  /**
   * Delete an anomaly
   * @param {Object} filter - Filter criteria
   * @returns {Promise<boolean>} - Success status
   */
  static deleteOne(filter = {}) {
    const anomaly = memoryStore.findOne('anomalies', filter);
    if (!anomaly) return Promise.resolve(false);
    
    return Promise.resolve(memoryStore.deleteOne('anomalies', anomaly._id));
  }
  
  /**
   * Create a new anomaly
   * @param {Object} data - Anomaly data
   */
  constructor(data) {
    Object.assign(this, data);
    
    // Set default values if not provided
    this.timestamp = this.timestamp || new Date();
    this.confirmed = this.confirmed !== undefined ? this.confirmed : false;
    this.resolved = this.resolved !== undefined ? this.resolved : false;
    
    if (!this._id) {
      this._id = Date.now().toString();
    }
  }
  
  /**
   * Save the anomaly
   * @returns {Promise<Object>} - Saved anomaly
   */
  async save() {
    // If the anomaly already exists in the store, update it
    if (this._id) {
      memoryStore.updateOne('anomalies', this._id, this);
    } else {
      memoryStore.insertOne('anomalies', this);
    }
    
    return Promise.resolve(this);
  }
}

module.exports = Anomaly; 