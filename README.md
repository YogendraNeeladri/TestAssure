# TestAssure

Live Link: https://test-assure-xr6h.vercel.app/

TestAssure is a smart automated testing tool for e-commerce web applications. It leverages AI to generate comprehensive test cases from a given URL, allowing you to review, execute, and get a detailed report of the test results.

## Features

- **AI-Powered Test Case Generation**: Enter a URL and get a list of relevant test cases for your e-commerce site.
- **Editable Test Cases**: Review and modify the generated test cases to fit your specific needs.
- **Test Execution**: Run individual tests or all tests at once to simulate user interactions.
- **Detailed Reporting**: View a comprehensive report of test results, including pass/fail status and a summary dashboard.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/YogendraNeeladri/TestAssure.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd TestAssure
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root of your project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Application

This project uses Genkit, which requires a separate process to be running for the AI features.

1.  **Start the Genkit server**:
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit development server and watch for changes in your AI flows.

2.  **Start the Next.js development server**:
    In a separate terminal, run:
    ```bash
    npm run dev
    ```
    This will start the Next.js application.

3.  Open your browser and navigate to [http://localhost:9002](http://localhost:9002) to see the application in action.

