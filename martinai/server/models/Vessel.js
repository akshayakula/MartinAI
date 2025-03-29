const memoryStore = require('../services/memoryStore');

/**
 * Vessel model using in-memory store instead of Mongoose
 */
class Vessel {
  /**
   * Find vessels based on criteria
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} - Array of vessels
   */
  static find(filter = {}) {
    return Promise.resolve(memoryStore.find('vessels', filter));
  }
  
  /**
   * Find one vessel
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object|null>} - Vessel or null
   */
  static findOne(filter = {}) {
    return Promise.resolve(memoryStore.findOne('vessels', filter));
  }
  
  /**
   * Find vessel by ID
   * @param {string} id - Vessel ID
   * @returns {Promise<Object|null>} - Vessel or null
   */
  static findById(id) {
    return Promise.resolve(memoryStore.findOne('vessels', { _id: id }));
  }
  
  /**
   * Count vessels
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} - Count
   */
  static countDocuments(filter = {}) {
    return Promise.resolve(memoryStore.countDocuments('vessels', filter));
  }
  
  /**
   * Delete a vessel
   * @param {Object} filter - Filter criteria
   * @returns {Promise<boolean>} - Success status
   */
  static deleteOne(filter = {}) {
    const vessel = memoryStore.findOne('vessels', filter);
    if (!vessel) return Promise.resolve(false);
    
    return Promise.resolve(memoryStore.deleteOne('vessels', vessel._id));
  }
  
  /**
   * Create a new vessel
   * @param {Object} data - Vessel data
   */
  constructor(data) {
    Object.assign(this, data);
    
    // Set default values if not provided
    this.lastSeen = this.lastSeen || new Date();
    this.history = this.history || [];
    
    if (!this._id) {
      this._id = Date.now().toString();
    }
  }
  
  /**
   * Save the vessel
   * @returns {Promise<Object>} - Saved vessel
   */
  async save() {
    // If the vessel already exists in the store, update it
    const existingVessel = await Vessel.findOne({ mmsi: this.mmsi });
    
    if (existingVessel) {
      memoryStore.updateOne('vessels', existingVessel._id, this);
    } else {
      memoryStore.insertOne('vessels', this);
    }
    
    return Promise.resolve(this);
  }
}

module.exports = Vessel; 