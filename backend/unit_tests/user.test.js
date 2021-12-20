const { getNewToken } = require("../utils/jwtService");
const { findOne, create  } = require("../models/user");
const Handler = require("../handlers/user");
const Boom = require('boom');
const { getUserSchema, createSchema, loginEmailSchema, loginUsernameSchema, addFeedbackSchema, FileSchema } = require("../validations/userSchema");

jest.mock("../models/user", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

jest.mock("mongodb", () => ({
    ObjectId: jest.fn()
}));

jest.mock("../utils/jwtService", () => ({
    getNewToken: jest.fn()
}));

// Test coverage 100%
describe("getUser function", () => {

    it("should return error on invalid userId", async () => {
        const userId = 10
        const { error } = getUserSchema.validate({ userId })
        try {
            await Handler.getUser(userId)
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("should return user not found on null api response", async () => {
        findOne.mockImplementation(() => null)
        const userId = "1001"
        try {
            await Handler.getUser(userId)
        } catch(e) {
            expect(e).toEqual(Boom.notFound("User does not exist"))
        }
    })

    it("should return success response", async () => {
        const userId = "1001"
        const expectedResponse = { username: "john", email: "john_doe@gmail.com", role: "user" }
        findOne.mockImplementation(() => expectedResponse)
        expect(await Handler.getUser(userId)).toEqual(expectedResponse)
    })
})

// Test coverage 100%
describe("Register user", () => {
    it("Should return response upon successful registration", async () => {
        payload = { name: "blank1", username: "blank1", email: "blankUser1@gmail.com", password: "blank1", role: "user"  }
        expectedResponse = { _id: "1234", name: "blank1", username: "blank1", email: "blankUser1@gmail.com", password: "blank1", role: "user" };

        findOne.mockImplementation(() => null)
        create.mockImplementation(() => expectedResponse)

        expect(await Handler.createUser(payload)).toEqual(expectedResponse)
    })

    it("Should return error invalid email", async () => {
        payload = { name: "first", username: "firstlast", password: "firstlast", email: "first.lastatgmaildotcom", role: "user" }
        const { error } = createSchema.validate(payload, { allowUnknown: true })

        try{
            await Handler.createUser(payload)
        } catch (e){
            expect(e).toEqual(error)
        }
    })

    it("Should return error user already exists", async () => {
        payload = { name: "Test", username: "Test", password: "Test", email: "Test@gmail.com", role: "user" }
        findOne.mockImplementation(() => null)

        try {
            await Handler.createUser(payload)
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
        expect(await Handler.loginUserWithUsername(payload)).toEqual(expectedResponse)
    })

    it("Should return current user and token on successful login with email credential", async () => {
        const token = "9876"
        const payload = { email: "john_appleseed@gmail.com", password: "appleseed" }
        const seedUser = { _id: "1234", name: "john", username: "john", email: "john_appleseed@gmail.com", role: "user" }
        const currentUser = { userId: "1234", name: "john", username: "john", email: "john_appleseed@gmail.com", role: "user" }

        findOne.mockImplementation(() => seedUser)

        getNewToken.mockImplementation(() => token)

        expectedResponse = { token, currentUser }
        expect(await Handler.loginUserWithEmail(payload)).toEqual(expectedResponse)
    })

    it("Should return error username and password required", async () => {
        payload = { username: "", password: "appleseed" }
        const { error } = loginUsernameSchema.validate(payload)

        try {
            await Handler.loginUserWithUsername(payload)
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("Should return error email and password required", async () => {
        payload = { email: "", password: "appleseed" }
        const { error } = loginEmailSchema.validate(payload)

        try {
            await Handler.loginUserWithEmail(payload)
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("Should return Username or password incorrect upon invalid credentials", async () => {
        payload = { username: "john", password: "appleseed" }
        findOne.mockImplementation(() => null)

        try {
            await Handler.loginUserWithUsername(payload)
        } catch(e) {
            expect(e).toEqual(Boom.notFound("Username or password is incorrect."))
        }
    })

    it("Should return Email or password incorrect upon invalid credentials", async () => {
        payload = { email: "john_Appleseed@gmail.com", password: "appleseed" }
        findOne.mockImplementation(() => null)

        try {
            await Handler.loginUserWithEmail(payload)
        } catch(e) {
            expect(e).toEqual(Boom.badRequest("Email or password is incorrect."))
        }
    })
})

// Test coverage 100%
describe("Audio File (Add, Remove)", () => {
    it("Should validate request parameter", async() => {
        let payload = {
            userId: undefined,
            description: "test description",
            gcs_uri: "gs://capstone-audios/audio.wav",
            created: "10/11/2021"
        }
        const { error } = FileSchema.validate(payload)
    
        try {
            await Handler.addAudioFile(payload);
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("Should validate request payload fields", async() => {
        let payload = {
            userId: "12345",
            description: "test description",
            gcs_uri: undefined,
            created: "10/11/2021"
        }
        const { error } = FileSchema.validate(payload)
    
        try {
            await Handler.addAudioFile(payload);
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

})

// Test coverage 100%
describe("Summary File (Add, Remove)", () => {
    it("Should validate request parameter", async() => {
        let payload = {
            userId: undefined,
            feedbackType: "manuscript",
            q1: "good",
            q2: "average",
            q3: "very good",
            comment: "test comment"
        }
        const { error } = addFeedbackSchema.validate(payload)
    
        try {
            await Handler.addSummaryFile(payload);
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("Should validate request payload fields", async() => {
        let payload = {
            userId: "12345",
            feedbackType: "manuscript",
            q1: undefined,
            q2: "average",
            q3: "very good",
            comment: "test comment"
        }
        const { error } = addFeedbackSchema.validate(payload)
    
        try {
            await Handler.addSummaryFile(payload);
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

    it("Should validate feedback Type values", async() => {
        let payload = {
            userId: "12345",
            feedbackType: "hello",
            q1: "poor",
            q2: "average",
            q3: "very good",
            comment: "test comment"
        }
        const { error } = addFeedbackSchema.validate(payload)
    
        try {
            await Handler.addSummaryFile(payload);
        } catch(e) {
            expect(e).toEqual(error)
        }
    })

})