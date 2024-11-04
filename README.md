# TEEMA - Team and Employee Management Application

Teema is a modern team management platform built with Next.js 15, TypeScript, and MongoDB. It provides a secure and intuitive interface for managing teams and team members within an organization.

## Output
![Teema Demo](./assets/Teema-video.gif)

## 🚀 Features

### Authentication & Authorization
- Secure user authentication using NextAuth.js
- Protected routes with middleware
- JWT-based session management

### Team Management
- Create and manage teams
- Add/remove team members
- Real-time search functionality for teams and members
- Role-based access control for team operations

### User Interface
- Responsive design that works on mobile and desktop
- Modern UI with Tailwind CSS
- Custom loading states and animations
- Error handling with popup notifications

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: React Icons

## 🔒 Security Features

- Password hashing with bcrypt
- Protected API routes
- Session-based authentication
- Environment variable protection

## 💻 Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=your_deployment_domain
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## 📦 Dependencies

Key dependencies include:
- next: 15.0.2
- react: 19.0.0
- mongodb: ^8.7.3
- next-auth: ^4.24.10
- tailwindcss: ^3.4.1
- typescript: ^5.6.3

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.