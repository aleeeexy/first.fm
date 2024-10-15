# first.fm

first.fm is a web application that allows users to track their music listening habits, discover new music, and connect with other music enthusiasts.

## Project Structure

```
first-fm/
├── frontend/          # React frontend
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   └── package.json
├── .github/
│   └── workflows/     # CI/CD configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/alexy/first-fm.git
   cd first-fm
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the `backend` directory with the following content:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

The application should now be running at `http://localhost:3000`.

## Testing

To run tests for the backend:
```
cd backend
npm test
```

To run tests for the frontend:
```
cd frontend
npm test
```

## Deployment

The application is set up to automatically deploy to Heroku when changes are pushed to the main branch, provided all tests pass.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
