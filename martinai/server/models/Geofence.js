const memoryStore = require('../services/memoryStore');

/**
 * Geofence model using in-memory store instead of Mongoose
 */
class Geofence {
  /**
   * Find geofences based on criteria
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} - Array of geofences
   */
  static find(filter = {}) {
    return Promise.resolve(memoryStore.find('geofences', filter));
  }
  
  /**
   * Find one geofence
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object|null>} - Geofence or null
   */
  static findOne(filter = {}) {
    return Promise.resolve(memoryStore.findOne('geofences', filter));
  }
  
  /**
   * Find geofence by ID
   * @param {string} id - Geofence ID
   * @returns {Promise<Object|null>} - Geofence or null
   */
  static findById(id) {
    return Promise.resolve(memoryStore.findOne('geofences', { _id: id }));
  }
  
  /**
   * Count geofences
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} - Count
   */
  static countDocuments(filter = {}) {
    return Promise.resolve(memoryStore.countDocuments('geofences', filter));
  }
  
  /**
   * Delete a geofence
   * @param {Object} filter - Filter criteria
   * @returns {Promise<boolean>} - Success status
   */
  static deleteOne(filter = {}) {
    const geofence = memoryStore.findOne('geofences', filter);
    if (!geofence) return Promise.resolve(false);
    
    return Promise.resolve(memoryStore.deleteOne('geofences', geofence._id));
  }
  
  /**
   * Create a new geofence
   * @param {Object} data - Geofence data
   */
  constructor(data) {
    Object.assign(this, data);
    
    // Set default values if not provided
    this.active = this.active !== undefined ? this.active : true;
    this.createdAt = this.createdAt || new Date();
    
    if (!this._id) {
      this._id = Date.now().toString();
    }
  }
  
  /**
   * Save the geofence
   * @returns {Promise<Object>} - Saved geofence
   */
  async save() {
    // If the geofence already exists in the store, update it
    if (this._id) {
      memoryStore.updateOne('geofences', this._id, this);
    } else {
      memoryStore.insertOne('geofences', this);
    }
    
    return Promise.resolve(this);
  }
}

module.exports = Geofence; 