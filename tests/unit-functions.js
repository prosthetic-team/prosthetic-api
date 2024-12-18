import { expect } from 'chai';
import request from 'supertest';
import app from './app-for-tests.js';

const generateUniqueUserData = () => {
    const timestamp = new Date().getTime();
    return {
        name: `User_${timestamp}`,
        email: `testuser_${timestamp}@example.com`,
        password: 'password123'
    };
};

export const testCreateUserSuccessfully = async () => {
    const userData = generateUniqueUserData();

    const response = await request(app)
        .post('/users')
        .send(userData);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('userId');
};

export const testCreateUserMissingFields = async () => {
    const userData = {
        name: 'NoFields',
        // email and password missing
    };

    const response = await request(app)
        .post('/users')
        .send(userData);

    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('message').that.includes('Error al crear usuario');
};

export const testGetAllUsers = async () => {
    const response = await request(app)
        .get('/users');

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
};

export const testGetUserById = async () => {
    const userData = generateUniqueUserData();

    const createResponse = await request(app)
        .post('/users')
        .send(userData);

    const userId = createResponse.body.userId;

    const response = await request(app)
        .get(`/users/${userId}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id', userId);
    expect(response.body).to.have.property('name', userData.name);
    expect(response.body).to.have.property('email', userData.email);
};

export const testUpdateUser = async () => {
    const userData = generateUniqueUserData();

    const createResponse = await request(app)
        .post('/users')
        .send(userData);

    const userId = createResponse.body.userId;

    const updatedData = {
        name: `Updated_${userData.name}`,
        email: `Updated_${userData.email}`
    };

    const response = await request(app)
        .put(`/users/${userId}`)
        .send(updatedData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Usuario actualizado exitosamente');

    const getResponse = await request(app).get(`/users/${userId}`);
    expect(getResponse.body).to.have.property('name', updatedData.name);
    expect(getResponse.body).to.have.property('email', updatedData.email);
};

export const testDeleteUser = async () => {
    const userData = generateUniqueUserData();

    const createResponse = await request(app)
        .post('/users')
        .send(userData);

    const userId = createResponse.body.userId;

    const response = await request(app)
        .delete(`/users/${userId}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Usuario eliminado exitosamente');

    const getResponse = await request(app).get(`/users/${userId}`);
    expect(getResponse.status).to.equal(404);
};

export const testLoginUserSuccessfully = async() => {
    const userData = generateUniqueUserData();

    await request(app).post('/users').send(userData);

    const response = await request(app).post('/users/login').send({
        email: userData.email,
        password: userData.password
    });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Login successful');
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('email', userData.email);
};

export const testLoginUserInvalidCredentials = async () => {
    const response = await request(app).post('/users/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
    });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message', 'Invalid credentials');
};

import sinon from 'sinon';
import axios from 'axios';

sinon.stub(axios, 'post');
sinon.stub(axios, 'get');

const baseUrl = 'http://iot.ceisufro.cl:8080';

export const testThingsboardLogin = async () => {
    const mockToken = 'mockBearerToken';
    axios.post.resolves({ data: { token: mockToken } });

    const response = await request(app)
        .post('/thingsboard/login')
        .send({ username: 'testuser', password: 'password'});

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token', mockToken);
};

export const testTelemetryDataRetrieval = async () => {
    const mockTelemetry = {
        "gyroscope-x": [{ ts: 1730982476951, value: "16.72363" }],
        "accelerometer-y": [{ ts: 1730982476951, value: "-0.06704949" }]
    };
    axios.get.resolves({ data: mockTelemetry });

    const deviceId = '32735bc0-9cfb-11ef-8d2d-4d85475624ac';
    const response = await request(app).get(`/thingsboard/telemetry/${deviceId}`);

    // Assert
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockTelemetry);
};