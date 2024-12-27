# Cursor Pagination with View Scroll

## Description

This project implements a cursor-based pagination system with a virtual scroll feature for efficient data loading. It is built using TypeScript, Express for the backend, and Next.js with React-Query for the frontend.

## Features

- Cursor-based pagination for efficient data retrieval.
- Virtual scrolling to enhance performance when displaying large datasets.
- API endpoints for managing orders.
- Tailwind CSS for styling.
- React-Query for data management
- Client side sorting

## Technologies Used

- **Backend**: TypeScript, Express, Prisma, PostgreSQL
- **Frontend**: Next.js, React, Tailwind CSS
- **Testing**: Vitest, Supertest

## Installation


### Prerequisites

- Node.js
- PostgreSQL
- Yarn or npm

### Clone the repository

```bash
git clone https://github.com/rahul-MyGit

cd order-management
```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and configure your environment variables:

   ```
   PORT=4000
   DATABASE_URL=your_database_url
   ```

4. Run the database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the database (optional):

   ```bash
   npm run seed
   ```

6. Start the backend server:

   ```bash
   npm run dev
   ```

7. To test the endpoint:

   ```bash
   npm run test
   ```

## Usage

Once both the backend and frontend servers are running, you can access the application at `http://localhost:3000`.

## API Documentation

### Get Orders

- **Endpoint**: `/api/v1/orders`
- **Method**: `GET`
- **Query Parameters**:
  - `cursor`: (optional) The cursor for pagination.
  - `limit`: (optional) The number of items to return (default is 50).
  - `sort`: (optional) The field to sort by (default is `createdAt`).
  - `sortDirection`: (optional) The direction to sort (default is `desc`).

  ```bash
  EXAMPLE_URL: http://localhost:4000/api/v1/orders?cursor=cm559s2e606adhpisycu46q8i&limit=50&sort=createdAt&sortDirection=desc
  ```

#### Response

```bash
json
{
"data": [
            {
                "id": "1",
                "customerName": "Test Customer 1",
                "orderAmount": 100.50,
                "status": "pending",
                "createdAt": "2022-01-01T00:00:00Z"
            }
        ],
"nextCursor": "2",
"totalCount": 100,
"hasNextPage": true
}
```


## Testing

To run tests, navigate to the backend directory and run:
```bash
npm run test
```


## Performance Notes

1. **Batch Processing**: The seeding process uses batch processing to insert multiple records at once, which is more efficient than inserting records one by one.

2. **Caching with React-Query**: The use of React-Query for data fetching and caching reduces the number of network requests and improves the user experience.

3. **Error Handling**: Proper error handling in API responses ensures that the application can easily handle issues without crashing.

4. **Zod**: For proper types checking of the params.

## List of Potential Improvements

1. **Rate Limiting**: Implement rate limiting on the API endpoints to prevent abuse and ensure fair usage among users.

2. **Pagination on the Frontend**: Instead of Infinite Scrolling the pagination with pages can be implemented as it's more UI friendly.

3. **States**: State can be used in much cleaner and optimal way.

4. **Testing Coverage**: Tests can be more optimal to cover every edge cases of the application.

5. **Monitoring and Analytics**: Integrate prometheus and grafana for monitoring the server. So that it'll serve at least P90.

6. **Redis**: If the pagination is result is required by other services then we can use redis for cache. Also it would be optimal if there are many requests.
