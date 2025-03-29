const request = require('supertest');
const express = require('express');
const vesselRoutes = require('../../routes/vessels');
const datalasticService = require('../../services/datalastic');

// Mock the datalastic service
jest.mock('../../services/datalastic');

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/api/vessels', vesselRoutes);

describe('Vessel Routes', () => {
  beforeEach(() => {
    // Reset all 