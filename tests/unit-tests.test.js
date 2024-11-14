
import { describe, it } from "mocha";
import { clearDatabase } from "./db-setup.test.js";
import {
    testCreateUserSuccessfully,
    testCreateUserMissingFields,
    testDeleteUser,
    testGetAllUsers,
    testGetUserById,
    testUpdateUser
} from "./unit-functions.js";

// Clear the database before running tests
before((done) => {
    clearDatabase(done);
});

// User-related tests

describe('Prueba unitaria para crear usuario', () => {
    it('Debería permitir crear un usuario correctamente', testCreateUserSuccessfully);
});

describe('Prueba unitaria para crear usuario', () => {
    it('No debería permitir crear un usuario con campos faltantes', testCreateUserMissingFields);
});

describe('Prueba unitaria para obtener todos los usuarios', () => {
    it('Debería obtener todos los usuarios', testGetAllUsers);
});

describe('Prueba unitaria para obtener usuario por ID', () => {
    it('Debería obtener un usuario por ID', testGetUserById);
});

describe('Prueba unitaria para actualizar usuario', () => {
    it('Debería actualizar un usuario correctamente', testUpdateUser);
});

describe('Prueba unitaria para eliminar usuario', () => {
    it('Debería eliminar un usuario correctamente', testDeleteUser);
});

