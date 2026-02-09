# Wavey - AI Workflow Builder

**Wavey** is a powerful visual workflow builder designed for creating AI-powered content generation pipelines. It empowers users to connect various processing nodes—text, images, videos, and AI models—to automate complex creative tasks without writing code.

![Wavey Dashboard](./public/dashboard-preview.png)

## 🚀 Key Features

- **Visual Workflow Editor**: Intuitive drag-and-drop interface powered by [React Flow](https://reactflow.dev/).
- **AI Integration**: Seamlessly integrate **Google Gemini** for text and vision capabilities.
- **Media Processing**:
  - **Upload Nodes**: Support for Images and Videos.
  - **Crop Image**: Intelligent cropping with customizable parameters.
  - **Extract Frame**: Grab specific frames from videos for analysis.
- **Dashboard**:
  - **Template Library**: 10+ pre-built workflow templates (e.g., Image Describer, Marketing Kit).
  - **Horizontal Navigation**: Smooth scrolling workflow browser.
  - **File Management**: Organized "My Files" section with grid/list views.
- **Robust Execution**:
  - **Trigger.dev Integration**: Reliable background job processing for long-running workflows.
  - **Execution History**: Track past runs, view status, and inspect outputs.
  - **DAG Validation**: Prevents cycles and ensures valid connection logic.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: PostgreSQL (via [Prisma](https://www.prisma.io/))
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Background Jobs**: [Trigger.dev](https://trigger.dev/)
- **UI Components**: Radix UI, Lucide React
- **Animations**: Framer Motion, GSAP

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **NPM** (or Yarn/PNPM/Bun)
- **Trigger.dev CLI** (`npm i -g trigger.dev`)

You will also need accounts/API keys for:
- [Google AI Studio](https://aistudio.google.com/) (Gemini API)
- [Trigger.dev](https://trigger.dev/) (Project ID & API Key)
- [Neon](https://neon.tech/) or any PostgreSQL provider.
- [Transloadit](https://transloadit.com/) (Optional, for real media processing)

## ⚙️ Configuration

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/galexy.git
    cd galexy
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and configure the following variables:

    ```env
    # Database (PostgreSQL)
    DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

    # Trigger.dev (Background Jobs)
    TRIGGER_SECRET_KEY="tr_dev_xxxxxxxxxxxx"
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY="tr_pub_xxxxxxxxxxxx"
    TRIGGER_PROJECT_ID="your-project-id"

    # Google Gemini (AI Model)
    GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

    # Transloadit (Media Processing) - Optional
    # If not provided, media nodes will use mock/local fallback modes.
    TRANSLOADIT_KEY="your_auth_key"
    TRANSLOADIT_SECRET="your_auth_secret"
    ```

## 🏃‍♂️ Running the Application

To run the full stack locally, you need to start the Next.js development server and the Trigger.dev background worker.

1.  **Start the Database**:
    Ensure your database schema is up to date.
    ```bash
    npx prisma generate
    npx prisma db push
    ```

2.  **Start Trigger.dev Worker**:
    Open a new terminal and run:
    ```bash
    npx trigger.dev@latest dev
    ```
    *Follow the CLI prompts to link your project if running for the first time.*

3.  **Start the Next.js App**:
    In a separate terminal, run:
    ```bash
    npm run dev
    ```

4.  **Access the App**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 User Guide

### Building a Workflow
1.  **Create**: Click "Create New File" on the dashboard or select a template.
2.  **Add Nodes**: Drag nodes from the left sidebar (Text, Image, Video, Utility, AI).
3.  **Connect**: Draw lines between output handles and input handles.
    *   *Note: color-coded handles indicate strict type compatibility (e.g., Image → Image).*
4.  **Configure**: Click on a node to set its properties (uploaded files, prompts, crop settings).

### Running a Workflow
1.  **Execute**: Click the **Run** button in the top toolbar.
2.  **Monitor**: Watch the progress in the **History Panel** on the right.
3.  **Inspect**: Once completed, output data (text responses, processed images) will appear directly on the nodes.

## 📂 Project Structure

```
galexy/
├── .trigger/               # Trigger.dev configuration
├── docs/                   # Detailed documentation
│   ├── CONFIGURATION.md    # Env & Setup details
│   ├── DASHBOARD_FEATURES.md # UI feature breakdown
│   ├── USER_GUIDE.md       # End-user manual
│   └── ...
├── prisma/                 # Database schema
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/
│   │   ├── editor/         # Workflow editor (Nodes, Canvas, Panels)
│   │   ├── ui/             # Reusable UI components
│   │   └── ...
│   ├── lib/                # Utilities & Helpers
│   ├── trigger/            # Background tasks definitions
│   └── ...
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) (if available) or simply fork the repo and submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
