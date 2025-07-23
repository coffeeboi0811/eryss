<div align="center">
  <img src="public/logo.svg" alt="Eryss Logo" width="120" height="120" />
  
  # [Eryss](https://eryss.vercel.app)
  ### Discover and share visual inspiration
  
  <img src="public/og-default.png" alt="Eryss Preview" width="600" />
  
</div>

---

## ✨ About

**Eryss** is where visual inspiration lives. Think Pinterest, but cleaner. Upload, discover, and save images that catch your eye. Whether you're hunting for design ideas, building mood boards, or just appreciating good aesthetics, this is your space.

## 🚀 Features

-   **🖼️ Masonry Grid Layout** - Responsive grid that adapts to different image sizes
-   **👤 User Profiles** - Personal spaces for your curated collections
-   **❤️ Like & Save** - Save images to collections and show appreciation
-   **🔍 Search** - Find images and users
-   **🌍 Explore** - Discover trending and popular content
-   **👥 Follow System** - Follow users and build your network
-   **📱 Responsive** - Works on desktop, tablet, and mobile
-   **🔐 Authentication** - Google OAuth integration
-   **⚡ Performance** - Optimized with App Router, image lazy loading, and efficient caching

## 🛠️ Tech Stack

### Frontend

-   **[Next.js 15](https://nextjs.org/)** - React framework with App Router
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
-   **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
-   **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library
-   **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations and transitions

### Backend & Database

-   **[PostgreSQL](https://postgresql.org/)** - Primary database
-   **[Prisma](https://prisma.io/)** - Type-safe database ORM
-   **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Backend API endpoints
-   **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
-   **[Cloudinary](https://cloudinary.com/)** - Image optimization and delivery

### Development Tools

-   **[Vercel](https://vercel.com/)** - Deployment platform
-   **[ESLint](https://eslint.org/)** - Code linting and formatting
-   **[Zod](https://zod.dev/)** - Schema validation
-   **[React Masonry CSS](https://github.com/paulcollett/react-masonry-css)** - Grid layout

## ⚙️ Local Development

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   PostgreSQL database (or your preferred database)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/coffeeboi0811/eryss.git
    cd eryss
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Fill in your database URL, NextAuth secret, and other required variables.

4. **Set up the database**

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

5. **Run the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**CoffeeBoi** - [@coffeeboi0811](https://github.com/coffeeboi0811)

---

<div align="center">
  <p><i>Built with lots of ☕</i></p>
  
 **[Report Bug](https://github.com/coffeeboi0811/eryss/issues)** • **[Request Feature](https://github.com/coffeeboi0811/eryss/issues)**
</div>
