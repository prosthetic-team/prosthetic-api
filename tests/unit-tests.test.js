
import { describe, it, before, after } from "mocha";
import { clearDatabase } from "./db-setup.test.js";
import {
    testCreateUserSuccessfully,
    testCreateUserMissingFields,
    testDeleteUser,
    testGetAllUsers,
    testGetUserById,
    testUpdateUser,
    testLoginUserSuccessfully,
    testLoginUserInvalidCredentials,
    testThingsboardLogin,
    testTelemetryDataRetrieval
} from "./unit-functions.js";

// Clear the database before running tests
before((done) => {
    clearDatabase(done);
});

// Clear the database after running tests
after((done) => {
    clearDatabase(done);
});

// User-related tests

describe('Pruebas unitarias para CRUD de usuarios', () => {
    it('Debería permitir crear un usuario correctamente', testCreateUserSuccessfully);
    it('No debería permitir crear un usuario con campos faltantes', testCreateUserMissingFields);
    it('Debería obtener todos los usuarios', testGetAllUsers);
    it('Debería obtener un usuario por ID', testGetUserById);
    it('Debería actualizar un usuario correctamente', testUpdateUser);
    it('Debería eliminar un usuario correctamente', testDeleteUser);

});

describe('Prueba unitaria para login de usuario', () => {
    it('Debería permitir login con credenciales válidas', testLoginUserSuccessfully);
    it('No debería permitir login con credenciales inválidas', testLoginUserInvalidCredentials);
});

describe('Pruebas unitarias para integración con Thingsboard API', () => {
    it('Debería obtener un token válido al iniciar sesión', testThingsboardLogin);
    it('Debería obtener los datos de telemetría correctamente', testTelemetryDataRetrieval);
});
