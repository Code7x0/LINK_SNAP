# LinkSnap

A modern, secure platform that combines URL shortening and image compression capabilities. Built with React, Supabase, and Tailwind CSS, LinkSnap offers a seamless experience for managing your links and optimizing images.

<a href="https://strong-sunflower-f6d590.netlify.app/">LinkSnap Demo</a> 

## Features

- 🔐 **Secure Authentication**: Email and password-based authentication system
- 🌓 **Dark Mode**: Automatic dark mode support based on system preferences
- 🔗 **URL Management**: Create and manage your shortened URLs
- 📋 **Quick Copy**: One-click copying of shortened URLs
- 🖼️ **Image Compression**: Browser-based image optimization
- 📊 **Size Comparison**: View original vs. compressed image sizes
- 🎚️ **Quality Control**: Adjustable compression quality
- 🎨 **Modern UI**: Clean and responsive design using Tailwind CSS
- 🚀 **Fast Performance**: Built with Vite and React
- 🔒 **Row Level Security**: Secure data access with Supabase RLS policies

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linksnap.git
   cd linksnap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application requires a Supabase database with the following schema:

```sql
CREATE TABLE urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  original_url text NOT NULL,
  short_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  visits integer DEFAULT 0
);
```

Row Level Security (RLS) policies are implemented to ensure data security.

## Usage

### URL Shortening
1. Create an account or log in
2. Enter a URL you want to shorten
3. Click "Shorten URL"
4. Copy the shortened URL using the copy button
5. Share your shortened URL!

### Image Compression
1. Navigate to the image compression section
2. Upload an image (max 10MB)
3. Adjust the compression quality slider
4. Preview the compressed result
5. Download the optimized image

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
linksnap/
├── src/
│   ├── components/      # React components
│   │   ├── AuthForm.tsx       # Authentication component
│   │   ├── ImageCompressor.tsx # Image compression component
│   │   └── UrlShortener.tsx   # URL shortening component
│   ├── lib/            # Utility functions and configurations
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── supabase/          # Supabase configurations and migrations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Lucide](https://lucide.dev/) for the beautiful icons
