// tests should be run together

const app = require("../app")
const supertest = require("supertest");

const right_admin_data = {
    "email": "an email",
    "password": "a strong password1",
    "phone_number": "12345",
    "full_name": "just like this",
    "department": "a dep name",
    "organization": "somewhere",
    "office": "somewhere else",
    "working_hours": 9
}
const wrong_admin_pass = 'a wrong password'
const weak_password = 'a weak pass'
const right_emp1_data = {
    "email": "another email",
    "password": "a strong password1",
    "phone_number": "12345",
    "full_name": "just like this",
    "department": "a dep name",
    "organization": "somewhere",
    "office": "somewhere else",
    "working_hours": 9
}
const wrong_emp1_data = {
    "email": "another email",
    "password": "another wrong password1",
    "phone_number": "12345",
    "full_name": "just like this",
    "department": "a dep name",
    "organization": "somewhere",
    "office": "somewhere else",
    "working_hours": 9
}
const right_emp2_data = {
    "email": "a third email",
    "password": "a strong password2",
    "phone_number": "12345",
    "full_name": "just like this",
    "department": "a dep name",
    "organization": "somewhere",
    "office": "somewhere else",
    "working_hours": 9
}
let admin_token
let emp1_token


test("sign up admin with weak password, unsuccessful", async () => {
    let req = JSON.parse(JSON.stringify(right_admin_data))
    req.password = weak_password

    const response = await supertest(app).post('/sign_up_admin').send(req);
    const data = response.body

    expect(response.status).toBe(406)
    expect(data.message).toBe("Sign up is invalid!")
});


test("sign up admin first time, successful", async () => {
    const response = await supertest(app).post('/sign_up_admin').send(right_admin_data);
    expect(response.status).toBe(200)
    const data = response.body
    expect(data.message).toBe("Admin user is created successfully!")
});

test("sign up admin second time, unsuccessful", async () => {
    const response = await supertest(app).post('/sign_up_admin').send(right_admin_data);
    expect(response.status).toBe(406)
    const data = response.body
    expect(data.message).toBe("An admin already exists!")
});

test("login admin first time, unsuccessful", async () => {
    const response = await supertest(app).post('/login').send({
        email: right_admin_data.email,
        password: wrong_admin_pass
    })
    expect(response.status).toBe(406)
    const data = response.body
    expect(data.message).toBe('Email or password is not correct!')
})


test("login admin first time, successful", async () => {
    const response = await supertest(app).post('/login').send({
        email: right_admin_data.email,
        password: right_admin_data.password
    })
    expect(response.status).toBe(200)
    const data = response.body
    expect(data.message).toBe('login successful!')
    expect(data.token)
    expect(undefined)
})

test("login admin second time, unsuccessful", async () => {
    const response = await supertest(app).post('/login').send({
        email: right_admin_data.email,
        password: right_admin_data.password
    })
    expect(response.status).toBe(406)
    const data = response.body
    admin_token = data.token
    expect(data.message).toBe('User is already logged in!')
})

test("create employee 1, successful", async () => {
    let req = JSON.parse(JSON.stringify(right_emp1_data))
    req.token = admin_token
    const response = await supertest(app).post('/create_employee').send(req)
    expect(response.status).toBe(200)
    const data = response.body
    expect(data.message).toBe("Employee is created successfully!")
})


test("create employee 1 again, unsuccessful", async () => {
    let req = JSON.parse(JSON.stringify(right_emp1_data))
    req.token = admin_token
    const response = await supertest(app).post('/create_employee').send(req)
    expect(response.status).toBe(406)
    const data = response.body
    expect(data.message).toBe("Sign up is invalid. Either password is weak or the email is repeated")
})

test("create employee 2, successful", async () => {
    let req = right_emp2_data
    req.token = admin_token
    const response = await supertest(app).post('/create_employee').send(req)
    expect(response.status).toBe(200)
    const data = response.body
    expect(data.message).toBe("Employee is created successfully!")
})

test("login employee 1 with wrong pass, unsuccessful", async () => {
    const response = await supertest(app).post('/login').send(wrong_emp1_data)
    expect(response.status).toBe(406)
    const data = response.body
    expect(data.message).toBe("Email or password is not correct!")
})

test("login employee 1, successful ", async () => {
    const response = await supertest(app).post('/login').send(right_emp1_data)
    expect(response.status).toBe(200)
    const data = response.body
    expect(data.message).toBe("login successful!")
    emp1_token = data.token
})

test("login employee 1 while already logged in, unsuccessful ", async () => {
    const response = await supertest(app).post('/login').send(right_emp1_data)
    expect(response.status).toBe(406)
    const data = response.body
    expect(data.message).toBe("User is already logged in!")
})

test("login request without needed fields, unsuccessful ", async () => {
    const response = await supertest(app).post('/login').send({key: "value!"})
    expect(response.status).toBe(400)
    const data = response.body
    expect(data.message).toBe("Email and password are required!")
})




