// const { describe, test, beforeEach, after, before } = require("node:test");
// const assert = require("node:assert")
const mongoose = require("mongoose")
const { MONGODB_URL } = require("../utils/config") 
const app = require("../app")
const supertest = require("supertest")
const User = require("../models/user") 
const bcrypt = require("bcrypt") 

const api = supertest(app);


beforeAll(async () => {
  await mongoose.connect(MONGODB_URL);
})

describe("When there's initialy one user in the database", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("rootpassword", 10); 
    const user = new User({ username: "root", passwordHash })

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    await api.post("/api/users").send({ username: "uniqueUsername", password: "uniquePassword" }).expect(201).expect("Content-Type", /application\/json/ );

    const users = await User.find({});
    expect(users).toHaveLength(2);
    // assert.deepStrictEqual(users.length, 2);
  });

  test("creation fails with a username that already exists", async () => {
    await api.post("/api/users").send({ username: "root", password: "uniquePassword" }).expect(409).expect("Content-Type", /application\/json/ );

    const users = await User.find({});

    expect(users).toHaveLength(1)

    // assert.deepStrictEqual(users.length, 1);
  })


  test("creation fails if an username is not provided", async () => {
    await api.post("/api/users").send({ password: "uniquePassword" }).expect(400).expect("Content-Type", /application\/json/ );
  })


  test("creation fails if a password is not provided", async () => {
    await api.post("/api/users").send({ username: "test" }).expect(400).expect("Content-Type", /application\/json/ );
  })

  test("creation fails if username is less than 3 characters", async () => {
    await api.post("/api/users").send({ username: "ro", password: "uniquePassword" }).expect(400).expect("Content-Type", /application\/json/ );
  })

  test("creation fails if password is less than 3 characters", async () => {
    await api.post("/api/users").send({ username: "rootey", password: "ab" }).expect(400).expect("Content-Type", /application\/json/);
  })


  describe("login in with user", () => {
    test("succeeds if user exists", async () => {
      const response = await api.post("/api/login").send({ username: "root", password: "rootpassword" }).expect(200).expect("Content-Type", /application\/json/);

      const user = response.body;

      expect(user).toHaveProperty("token")
      expect(user).toHaveProperty("username")

      // assert.strictEqual(Object.prototype.hasOwnProperty.call(user, "token"), true); 
      // assert.strictEqual(Object.prototype.hasOwnProperty.call(user, "username"), true); 
    })


    test("fails if user doesn't exist", async () => {
      const response = await api.post("/api/login").send({ username: "randomuser", password: "randompassword" }).expect(401).expect("Content-Type", /application\/json/);

      const user = response.body;

      expect(user).toHaveProperty("error")
      expect(user.error).toEqual("invalid username or password")

      // assert.strictEqual(Object.prototype.hasOwnProperty.call(user, "error"), true); 
      // assert.strictEqual(user.error, "invalid username or password"); 

    })
  })
});

afterAll(async () => {
  await mongoose.connection.close()
})
