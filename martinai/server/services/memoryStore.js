/**
 * Simple in-memory data store to replace MongoDB
 */

// In-memory collections
const collections = {
  vessels: [],
  anomalies: [],
  geofences: []
};

// Generate simple IDs
let idCounter = 1;
const generateId = () => (idCounter++).toString();

/**
 * Find items in a collection
 * @param {string} collectionName - Name of collection
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options (sort, limit, skip)
 * @returns {Array} - Matching items
 */
function find(collectionName, filter = {}, options = {}) {
  if (!collections[collectionName]) {
    return [];
  }

  let results = [...collections[collectionName]];
  
  // Apply filters
  if (Object.keys(filter).length > 0) {
    results = results.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        // Simple equals filter
        if (typeof value === 'object' && value !== null) {
          // Handle special MongoDB operators like $lt, $gt, etc.
          if (value.$gt !== undefined && !(item[key] > value.$gt)) return false;
          if (value.$gte !== undefined && !(item[key] >= value.$gte)) return false;
          if (value.$lt !== undefined && !(item[key] < value.$lt)) return false;
          if (value.$lte !== undefined && !(item[key] <= value.$lte)) return false;
        } else if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }
  
  // Apply sort
  if (options.sort) {
    const sortKey = Object.keys(options.sort)[0];
    const sortDir = options.sort[sortKey];
    
    results.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDir === -1 ? 1 : -1;
      if (a[sortKey] > b[sortKey]) return sortDir === -1 ? -1 : 1;
      return 0;
    });
  }
  
  // Apply skip and limit
  if (options.skip) {
    results = results.slice(options.skip);
  }
  
  if (options.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
}

/**
 * Find one item in a collection
 * @param {string} collectionName - Name of collection
 * @param {Object} filter - Filter criteria
 * @returns {Object|null} - Matching item or null
 */
function findOne(collectionName, filter = {}) {
  const results = find(collectionName, filter);
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert an item into a collection
 * @param {string} collectionName - Name of collection
 * @param {Object} data - Data to insert
 * @returns {Object} - Inserted item with ID
 */
function insertOne(collectionName, data) {
  if (!collections[collectionName]) {
    collections[collectionName] = [];
  }
  
  const newItem = { 
    ...data, 
    _id: data._id || generateId(),
    createdAt: data.createdAt || new Date()
  };
  
  collections[collectionName].push(newItem);
  return newItem;
}

/**
 * Update an item in a collection
 * @param {string} collectionName - Name of collection
 * @param {string} id - Item ID
 * @param {Object} data - Data to update
 * @returns {Object|null} - Updated item or null
 */
function updateOne(collectionName, id, data) {
  if (!collections[collectionName]) {
    return null;
  }
  
  const index = collections[collectionName].findIndex(item => item._id === id);
  
  if (index === -1) {
    return null;
  }
  
  collections[collectionName][index] = { 
    ...collections[collectionName][index],
    ...data,
    updatedAt: new Date()
  };
  
  return collections[collectionName][index];
}

/**
 * Delete an item from a collection
 * @param {string} collectionName - Name of collection
 * @param {string} id - Item ID
 * @returns {boolean} - Success status
 */
function deleteOne(collectionName, id) {
  if (!collections[collectionName]) {
    return false;
  }
  
  const initialLength = collections[collectionName].length;
  collections[collectionName] = collections[collectionName].filter(item => item._id !== id);
  
  return collections[collectionName].length < initialLength;
}

/**
 * Count documents in a collection
 * @param {string} collectionName - Name of collection
 * @param {Object} filter - Filter criteria
 * @returns {number} - Count of documents
 */
function countDocuments(collectionName, filter = {}) {
  return find(collectionName, filter).length;
}

/**
 * Clear a collection or all collections
 * @param {string|null} collectionName - Name of collection to clear (null for all)
 */
function clearCollection(collectionName = null) {
  if (collectionName) {
    if (collections[collectionName]) {
      collections[collectionName] = [];
    }
  } else {
    // Clear all collections
    Object.keys(collections).forEach(key => {
      collections[key] = [];
    });
  }
}

module.exports = {
  find,
  findOne,
  insertOne,
  updateOne,
  deleteOne,
  countDocuments,
  clearCollection
}; 