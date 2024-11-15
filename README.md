
# Food Donation System API

This project is a food donation system that connects restaurants, charities, and volunteers to help reduce food waste and provide surplus food to those in need. The system includes user authentication, food posting, food request, delivery confirmation, and more.

---

## Getting Started

To get the server up and running on your local machine, follow the steps below:

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (locally or use MongoDB Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ayush123-bit/NuvGurukul.git

   cd NuvGurukul/backend

   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project with the following content (adjust values accordingly):

   ```env
  
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the server:

   ```bash
   node app.js
   ```

   The server will run at [http://localhost:3000](http://localhost:3000).

Alternatively, to run the server in development mode using `nodemon`:

```bash
 nodemon app.js
```

---

## Database Schema Description

### 1. User Schema (for Restaurants, Charities, and Volunteers)

The user schema stores information about users. There are three types of users in the system: restaurants, charities, and volunteers. Each user has a unique role.

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['restaurant', 'charity', 'volunteer'], required: true },
  createdAt: { type: Date, default: Date.now },
});
```

### 2. Food Posting Schema (for Restaurants)

This schema is used to store information about food donations created by restaurants. A food posting contains details like food name, description, quantity, expiry date, and location.

```js
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  expiry_date: { type: Date, required: true },
  location: { type: String, required: true },  // Store location as latitude,longitude
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
```

### 3. Food Request Schema (for Charities)

Charities can request food from the posted food donations. This schema stores the request details and references the charity user and food post.

```js
const foodRequestSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  charity: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
});
```

### 4. Volunteer Assignment Schema (for Restaurants)

Restaurants can assign volunteers to food deliveries. This schema keeps track of which volunteer is assigned to which food delivery.

```js
const volunteerAssignmentSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['assigned', 'in-progress', 'completed'], default: 'assigned' },
});
```



---

## API Documentation

The API is structured around three user roles: **restaurant**, **charity**, and **volunteer**. Each role has access to different sets of endpoints. Here’s a step-by-step guide to running each endpoint in sequence.

---

### 1. Register Users

Use this endpoint to create users for each role (restaurant, charity, and volunteer).

**Endpoint:** `POST /api/auth/register`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`

**Body:**
```json
{
    "name": "John Doe",
    "email": "restaurant@example.com",
    "password": "password123",
    "role": "restaurant"
}
```

Repeat with different emails and role values to create users for each role (e.g., charity, volunteer).

---

### 2. Log In to Get JWT Tokens

Log in to retrieve a JWT token for each user, which will be required for authorization in subsequent requests.

**Endpoint:** `POST /api/auth/login`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`

**Body:**
```json
{
    "email": "restaurant@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "token": "<jwt_token>"
}
```

Note: Copy this token, as it will be used in the `Authorization` header for other requests. Repeat this step for each user type (restaurant, charity, volunteer).

---

### 3. Create Food Posting (Restaurant Only)

A restaurant can create a food posting using their JWT token. Include the token in the `Authorization` header.

**Endpoint:** `POST /api/food`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/food`  
**Headers:** `Authorization: Bearer <restaurant_token>`

**Body:**
```json
{
    "name": "Surplus Sandwiches",
    "description": "Fresh sandwiches from today's stock",
    "quantity": 10,
    "expiry_date": "2024-12-31",
    "location": "40.7128,-74.0060"
}
```

---

### 4. Get Available Food Postings (Charity Only)

A charity user can retrieve a list of available food postings. Use the charity JWT token.

**Endpoint:** `GET /api/food`  
**Method:** `GET`  
**URL:** `http://localhost:3000/api/food`  
**Headers:** `Authorization: Bearer <charity_token>`

**Response:** A list of food postings marked as "Available".

---

### 5. Request Pickup for Food (Charity Only)

The charity user can request a pickup for a specific food posting by using its ID. Replace `{id}` with the actual food posting ID.

**Endpoint:** `POST /api/food/{id}/request`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/food/{id}/request`  
**Headers:** `Authorization: Bearer <charity_token>`

---

### 6. Approve or Reject Food Request (Restaurant Only)

The restaurant can approve or reject food requests from charities. Replace `{id}` with the actual food posting ID.

#### Approve Request:
**Endpoint:** `POST /api/food/{id}/approve`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/food/{id}/approve`  
**Headers:** `Authorization: Bearer <restaurant_token>`

#### Reject Request:
**Endpoint:** `POST /api/food/{id}/reject`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/food/{id}/reject`  
**Headers:** `Authorization: Bearer <restaurant_token>`

---

### 7. Assign Volunteer (Restaurant Only)

The restaurant user can assign a volunteer to a food posting. Replace `{id}` with the food posting ID and `volunteer_id` with the ID of the volunteer.

**Endpoint:** `POST /api/food/{id}/assign-volunteer`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/food/{id}/assign-volunteer`  
**Headers:** `Authorization: Bearer <restaurant_token>`

**Body:**
```json
{
    "volunteer_id": "<volunteer_user_id>"
}
```

---

### 8. Confirm Delivery (Volunteer Only)

The volunteer can confirm the delivery of a food posting. Replace `{id}` with the food posting ID.

**Endpoint:** `POST /api/food/{id}/confirm-delivery`  
**Method:** `POST`  
**URL:** `http://localhost:3000/api/food/{id}/confirm-delivery`  
**Headers:** `Authorization: Bearer <volunteer_token>`

# API Endpoint Test Cases

This document provides test cases for the various API endpoints in the application. Each endpoint has test cases for:

1. **Valid Request**: Expected behavior for valid inputs.
2. **Missing/Invalid Data**: Errors when required data is missing or invalid.
3. **Unauthorized Access**: Cases where a user tries to access without proper authorization.

---

### 1. User Registration

**Endpoint**: `POST /api/auth/register`

#### Test Cases

1. **Valid Registration**
   - **Input**: `{ "name": "John Doe", "email": "restaurant@example.com", "password": "password123", "role": "restaurant" }`
   - **Expected**: `201 Created`, user successfully registered.

2. **Missing Fields**
   - **Input**: `{ "name": "John Doe", "password": "password123", "role": "restaurant" }`
   - **Expected**: `400 Bad Request`, `"email" is required`.

3. **Invalid Role**
   - **Input**: `{ "name": "John Doe", "email": "restaurant@example.com", "password": "password123", "role": "invalid_role" }`
   - **Expected**: `400 Bad Request`, `"role" must be one of restaurant, charity, volunteer`.

---

### 2. User Login

**Endpoint**: `POST /api/auth/login`

#### Test Cases

1. **Valid Login**
   - **Input**: `{ "email": "restaurant@example.com", "password": "password123" }`
   - **Expected**: `200 OK`, returns JWT token.

2. **Invalid Password**
   - **Input**: `{ "email": "restaurant@example.com", "password": "wrongpassword" }`
   - **Expected**: `401 Unauthorized`, `"Invalid email or password"`.

3. **Unregistered Email**
   - **Input**: `{ "email": "nonexistent@example.com", "password": "password123" }`
   - **Expected**: `401 Unauthorized`, `"Invalid email or password"`.

---

### 3. Create Food Posting (Restaurant Only)

**Endpoint**: `POST /api/food`

#### Test Cases

1. **Valid Food Posting**
   - **Input**: `{ "name": "Sandwiches", "description": "Fresh stock", "quantity": 10, "expiry_date": "2024-12-31", "location": "40.7128,-74.0060" }`
   - **Expected**: `201 Created`, food posting added.

2. **Unauthorized Access (No Token)**
   - **Expected**: `403 Forbidden`, `"Authorization token required"`.

3. **Unauthorized Role**
   - **Expected**: `403 Forbidden`, `"Access denied"` (Use a restaurant user token).

---

### 4. Get Available Food Postings (Charity Only)

**Endpoint**: `GET /api/food`

#### Test Cases

1. **Valid Request**
   - **Expected**: `200 OK`, returns food listings.

2. **Unauthorized Access (No Token)**
   - **Expected**: `403 Forbidden`, `"Authorization token required"`.

3. **Unauthorized Role**
   - **Expected**: `403 Forbidden`, `"Access denied"` (Use a charity user token).

---

### 5. Request Pickup for Food (Charity Only)

**Endpoint**: `POST /api/food/{id}/request`

#### Test Cases

1. **Valid Request**
   - **Expected**: `200 OK`, pickup requested.

2. **Invalid Food ID**
   - **Expected**: `404 Not Found`, `"Food item not found"`.

3. **Unauthorized Role**
   - **Expected**: `403 Forbidden`, `"Access denied"` (Use a charity user token).

---

### 6. Approve or Reject Food Request (Restaurant Only)

**Endpoints**: `POST /api/food/{id}/approve`, `POST /api/food/{id}/reject`

#### Test Cases

1. **Approve Valid Request**
   - **Expected**: `200 OK`, request approved.

2. **Reject Valid Request**
   - **Expected**: `200 OK`, request rejected.

3. **Unauthorized Role**
   - **Expected**: `403 Forbidden`, `"Access denied"` (Use a restaurant user token).

---

### 7. Assign Volunteer (Restaurant Only)

**Endpoint**: `POST /api/food/{id}/assign-volunteer`

#### Test Cases

1. **Assign Valid Volunteer**
   - **Input**: `{ "volunteer_id": "<valid_volunteer_id>" }`
   - **Expected**: `200 OK`, volunteer assigned.

2. **Invalid Volunteer ID**
   - **Expected**: `404 Not Found`, `"Volunteer not found"`.

3. **Unauthorized Role**
   - **Expected**: `403 Forbidden`, `"Access denied"` (Use a restaurant user token).

---

### 8. Confirm Delivery (Volunteer Only)

**Endpoint**: `POST /api/food/{id}/confirm-delivery`

#### Test Cases

1. **Valid Confirmation**
   - **Expected**: `200 OK`, delivery confirmed.

2. **Invalid Food ID**
   - **Expected**: `404 Not Found`, `"Food item not found"`.

3. **Unauthorized Role**
   - **Expected**: `403 Forbidden`, `"Access denied"` (Use a volunteer token).

---

This document provides a structured outline for testing the behavior of each endpoint under different scenarios, ensuring robust handling of valid requests, errors, and unauthorized access attempts.

---

## Contact

For any questions or feedback, feel free to reach out to me at [ayushrai803@gmail.com].
