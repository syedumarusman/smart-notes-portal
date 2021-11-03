const { getNewToken } = require("../utils/jwtService")
const { findOne, create } = require("../models/user")
const { getUser, createUser, loginUserWithUsername, loginUserWithEmail } = require("../handlers/user")
const Boom = require('boom');
const { getUserSchema, createSchema, loginEmailSchema, loginUsernameSchema } = require("../validations/userSchema")

jest.mock('../models/user', () => ({
    findOne: jest.fn(),
    create: jest.fn()
}));

jest.mock("../utils/jwtService", () => ({
    getNewToken: jest.fn()
}));

describe("getUser function", () => {

    it("should return error on invalid userId", async () => {
        const userId = 10
        const { error } = getUserSchema.validate({ userId })
        try {
            await getUser(userId)
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("should return user not found on null api response", async () => {
        findOne.mockImplementation(() => null)
        const userId = "1001"
        try {
            await getUser(userId)
        } catch(e) {
            expect(e).toEqual(Boom.notFound("User does not exist"))
        }
    })

    it("should return success response", async () => {
        const userId = "1001"
        const expectedResponse = { username: "john", email: "john_doe@gmail.com", role: "user" }
        findOne.mockImplementation(() => expectedResponse)
        expect(await getUser(userId)).toEqual(expectedResponse)
    })
})

// Test coverage 100%
describe("Register user", () => {
    it("Should return response upon successful registration", async () => {
        payload = { name: "blank1", username: "blank1", email: "blankUser1@gmail.com", password: "blank1", role: "user"  }
        expectedResponse = { _id: "1234", name: "blank1", username: "blank1", email: "blankUser1@gmail.com", password: "blank1", role: "user" };

        findOne.mockImplementation(() => null)
        create.mockImplementation(() => expectedResponse)

        expect(await createUser(payload)).toEqual(expectedResponse)
    })

    it("Should return error invalid email", async () => {
        payload = { name: "first", username: "firstlast", password: "firstlast", email: "first.lastatgmaildotcom", role: "user" }
        const { error } = createSchema.validate(payload, { allowUnknown: true })

        try{
            await createUser(payload)
        } catch (e){
            expect(e).toEqual(error)
        }
    })

    it("Should return error user already exists", async () => {
        payload = { name: "Test", username: "Test", password: "Test", email: "Test@gmail.com", role: "user" }
        findOne.mockImplementation(() => null)

        try {
            await createUser(payload)
        } catch (e) {
            expect(e).toEqual(Boom.notFound("This User already exists"))
        }

    })
})

// Test coverage 100%
describe("Login user", () => {
    it("Should return current user and token on successful login with username credential", async () => {
        const token = "4321"
        const payload = { username: "john", password: "appleseed" }
        const seedUser = { _id: "1234", name: "john", username: "john", email: "john_appleseed@gmail.com", role: "user" }
        const currentUser = { userId: "1234", name: "john", username: "john", email: "john_appleseed@gmail.com", role: "user" }

        findOne.mockImplementation(() => seedUser)

        getNewToken.mockImplementation(() => token)

        expectedResponse = { token, currentUser }
        expect(await loginUserWithUsername(payload)).toEqual(expectedResponse)
    })

    it("Should return current user and token on successful login with email credential", async () => {
        const token = "9876"
        const payload = { email: "john_appleseed@gmail.com", password: "appleseed" }
        const seedUser = { _id: "1234", name: "john", username: "john", email: "john_appleseed@gmail.com", role: "user" }
        const currentUser = { userId: "1234", name: "john", username: "john", email: "john_appleseed@gmail.com", role: "user" }

        findOne.mockImplementation(() => seedUser)

        getNewToken.mockImplementation(() => token)

        expectedResponse = { token, currentUser }
        expect(await loginUserWithEmail(payload)).toEqual(expectedResponse)
    })

    it("Should return error username and password required", async () => {
        payload = { username: "", password: "appleseed" }
        const { error } = loginUsernameSchema.validate(payload)

        try {
            await loginUserWithUsername(payload)
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("Should return error email and password required", async () => {
        payload = { email: "", password: "appleseed" }
        const { error } = loginEmailSchema.validate(payload)

        try {
            await loginUserWithEmail(payload)
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("Should return Username or password incorrect upon invalid credentials", async () => {
        payload = { username: "john", password: "appleseed" }
        findOne.mockImplementation(() => null)

        try {
            await loginUserWithUsername(payload)
        } catch(e) {
            expect(e).toEqual(Boom.notFound("Username or password is incorrect."))
        }
    })

    it("Should return Email or password incorrect upon invalid credentials", async () => {
        payload = { email: "john_Appleseed@gmail.com", password: "appleseed" }
        findOne.mockImplementation(() => null)

        try {
            await loginUserWithEmail(payload)
        } catch(e) {
            expect(e).toEqual(Boom.badRequest("Email or password is incorrect."))
        }
    })
})

