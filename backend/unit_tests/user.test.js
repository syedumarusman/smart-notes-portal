const { findOne } = require("../models/user")
const { getUser } = require("../handlers/user")
const Boom = require('boom');
const { getUserSchema } = require("../validations/userSchema")

jest.mock('../models/user', () => ({
    findOne: jest.fn()
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
        findOne.mockImplementation(() => "Success")
        expect(await getUser(userId)).toEqual("Success")
    })
})

