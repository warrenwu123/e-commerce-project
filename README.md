# E-Commerce Project

This repository contains an e-commerce web application inspired by a YouTube tutorial. The project utilizes modern web development tools and frameworks to create a full-stack application.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- User authentication and authorization
- Product listing and detailed views
- Shopping cart functionality
- Order management
- Responsive UI design

## Technologies Used

### Frontend

- **Vite**: A fast build tool for modern web projects
- **React**: JavaScript library for building user interfaces
- **Redux**: State management tool
- **Shadcn**: UI component library

### Backend

- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/warrenwu123/e-commerce-project.git
   cd e-commerce-project

2. **Install dependencies**:

**For the frontend:**
 ```bash
   cd client/vite-project
   npm install
 ```

**For the backend:**
  ```bash
   cd server
   npm install
  ```


3. **Set up environment variables:**
  Create a .env file in the server directory with the following content:

  ```
   MONGO_URI=yourownmongodbURL
   CLOUDINARY_CLOUD_NAME=yourowncloudinaryname
   CLOUDINARY_API_KEY=yourowncloudinaryapikey
   CLOUDINARY_API_SECRET=yourowncloudinaryapisecret
```

**for cloudinary information, you can find it in cloudinary dashboard**

## Usage

**For the frontend:**
  ```bash
   cd client/vite-project
   npm run dev
  ```
**For the backend:**
  ```bash
   cd server
   npm run dev
  ```

## Contribution 
1. I added more filter options that make it more convenient,such as color, size,etc.
2. I change the way of displaying in order page, avoid repetative display of pending and confirm state for one single item
3. i changed the layout of product-detail page


  
 
