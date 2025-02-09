# Innovatera Shopping App - Server Side APIs

## Overview

The **Innovatera Shopping App** repository provides the server-side APIs essential for managing various components of the shopping platform. Developed using Node.js, these APIs serve as the backbone for handling user interactions, product management, orders, and more. The APIs are designed to be scalable, secure, and efficient.

## Features

### User Management
- **Endpoints**:
  - `POST /api/users/register`: Register a new user.
  - `POST /api/users/login`: Authenticate a user and generate a JWT.
  - `GET /api/users/:id`: Retrieve user profile information.
  - `PUT /api/users/:id`: Update user profile details.
  - `DELETE /api/users/:id`: Delete a user account.

### Poster Management
- **Endpoints**:
  - `POST /api/posters`: Create a new poster.
  - `GET /api/posters`: Retrieve a list of all posters.
  - `GET /api/posters/:id`: Retrieve details of a specific poster.
  - `PUT /api/posters/:id`: Update a poster's information.
  - `DELETE /api/posters/:id`: Delete a poster.

### Brand and Product Management
- **Endpoints**:
  - **Brands**:
    - `POST /api/brands`: Add a new brand.
    - `GET /api/brands`: Retrieve a list of all brands.
    - `GET /api/brands/:id`: Retrieve details of a specific brand.
    - `PUT /api/brands/:id`: Update brand information.
    - `DELETE /api/brands/:id`: Delete a brand.
  - **Products**:
    - `POST /api/products`: Add a new product.
    - `GET /api/products`: Retrieve a list of all products.
    - `GET /api/products/:id`: Retrieve details of a specific product.
    - `PUT /api/products/:id`: Update product information.
    - `DELETE /api/products/:id`: Delete a product.

### Variants and Variant Types
- **Endpoints**:
  - **Variants**:
    - `POST /api/variants`: Create a new product variant.
    - `GET /api/variants`: Retrieve a list of all variants.
    - `GET /api/variants/:id`: Retrieve details of a specific variant.
    - `GET /api/variants/type/:id`: Retrieve all variant by specific variantType.
    - `PUT /api/variants/:id`: Update variant information.
    - `DELETE /api/variants/:id`: Delete a variant.
  - **Variant Types**:
    - `POST /api/variant-types`: Add a new variant type.
    - `GET /api/variant-types`: Retrieve a list of all variant types.
    - `GET /api/variant-types/:id`: Retrieve details of a specific variant type.
    - `PUT /api/variant-types/:id`: Update variant type information.
    - `DELETE /api/variant-types/:id`: Delete a variant type.

### Coupon Codes
- **Endpoints**:
  - `POST /api/coupons`: Create a new coupon code.
  - `GET /api/coupons`: Retrieve a list of all coupon codes.
  - `GET /api/coupons/:id`: Retrieve details of a specific coupon code.
  - `PUT /api/coupons/:id`: Update a coupon code.
  - `DELETE /api/coupons/:id`: Delete a coupon code.

### Order Processing
- **Endpoints**:
  - `POST /api/orders`: Place a new order.
  - `GET /api/orders`: Retrieve a list of all orders.
  - `GET /api/orders/:id`: Retrieve details of a specific order.
  - `PUT /api/orders/:id`: Update order status or details.
  - `DELETE /api/orders/:id`: Cancel an order.

### Payment Gateway Integration
- **Endpoints**:
  - `POST /api/payments/charge`: Process a payment.
  - `GET /api/payments/:id`: Retrieve payment details.

### Notifications
- **Endpoints**:
  - `POST /api/notifications`: Send a new notification.
  - `GET /api/notifications`: Retrieve a list of notifications.
  - `GET /api/notifications/:id`: Retrieve details of a specific notification.

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)
- MongoDB or another database of your choice

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>

2. **Navigate to the Project Directory**
   Change to the project directory:
   ```bash
   cd <project-directory>

3. **Install Dependencies**
   After navigating to the project directory, install the required npm packages by running:
   ```bash
   npm install

4. **Set Up Environment Variables**

   To configure the application, you need to set up environment variables. These variables include sensitive information and configuration details required for the application to function properly. Follow these steps:

   1. **Create a `.env` File**
      In the root directory of the project, create a file named `.env`. You can use the provided `.env.example` file as a template:
      ```bash
      cp .env.example .env
      ```

   2. **Edit the `.env` File**
      Open the newly created `.env` file in a text editor. Add or update the configuration values to match your environment. The file might look something like this:
      ```env
      # Database Configuration
      DB_HOST=localhost
      DB_PORT=27017
      DB_NAME=your-database-name

      # JWT Configuration
      JWT_SECRET=your-secret-key

      # Application Port
      PORT=3000

      # Additional Configuration
      OTHER_ENV_VAR=value
      ```

   3. **Configure Required Variables**
      - **`DB_HOST`**: The hostname of your database server.
      - **`DB_PORT`**: The port on which your database server is running.
      - **`DB_NAME`**: The name of your database.
      - **`JWT_SECRET`**: A secret key used for signing JSON Web Tokens (JWTs).
      - **`PORT`**: The port on which the application server will run.

   Ensure that you set all required environment variables based on your application's needs. The exact variables and their values will depend on your application's configuration and deployment requirements.

   **Note:** Keep the `.env` file private and never commit it to version control. Add `.env` to your `.gitignore` file to prevent it from being included in your repository.

5. **Run the Application**

   To start the server and run the application, follow these steps:

   1. **Start the Server**
      Run the following command to start the Node.js server:
      ```bash
      npm start
      ```

   2. **Verify Application Startup**
      After running the command, you should see output indicating that the server is starting up. Look for messages such as:
      ```
      Server is running on http://localhost:3000
      ```

      The port number (`3000` in this example) may vary based on your configuration in the `.env` file.

   3. **Access the Application**
      Open your web browser and navigate to `http://localhost:3000` (or the port specified in your `.env` file). You should see the application running. Depending on the application's setup, this may be a web interface or a set of API endpoints.

   **Note:** If the application does not start as expected, check the console output for error messages. Common issues might include misconfigured environment variables, missing dependencies, or port conflicts.

6. **Verify the Installation**

   To ensure that the application is running correctly, follow these steps:

   1. **Check the Application in Your Browser**
      Open your web browser and go to `http://localhost:3000` (or the port specified in your `.env` file). You should see the application’s interface or a default landing page. This confirms that the server is up and running.

   2. **Test API Endpoints**
      If your application provides API endpoints, use tools like [Postman](https://www.postman.com/) or `curl` to test them. For example:
      ```bash
      curl http://localhost:3000/api/users
      ```
      This should return a list of users or an appropriate response from the API.

   3. **Check Logs for Errors**
      Review the console or application logs for any errors or warnings that may have occurred during startup or during your tests. Address any issues as needed based on the log output.

   4. **Run Tests**
      If the project includes unit or integration tests, run them to ensure that everything is functioning as expected:
      ```bash
      npm test
      ```
      This will execute the test suite and provide feedback on any issues detected during testing.

   5. **Verify Database Connection**
      Ensure that the application can connect to the database. You can check this by performing actions that involve database operations, such as creating or retrieving records.

   **Note:** If you encounter issues during verification, consult the troubleshooting section or check the project's documentation for further assistance.


