# AI-Powered Credit Card Statement Parser

This project is an intelligent web application that uses the Google Gemini multimodal AI to automatically parse and extract key information from uploaded PDF credit card statements. It is designed to handle both text-based and image-based (e.g., scanned) PDFs, making it a robust solution for real-world document processing.

## Objective

The goal of this application is to simplify the process of reviewing credit card statements by providing a tool that can instantly identify and display the most important data points, saving users from manual searching.

## Key Features

- **Drag & Drop PDF Upload**: A user-friendly interface for easily uploading PDF files.
- **Multimodal AI Processing**: Leverages the Gemini API's ability to understand both text and images, allowing it to parse scanned statements or documents where text is embedded in images.
- **Structured Data Extraction**: Reliably extracts a predefined set of key data points from any statement.
- **Clean & Responsive UI**: The interface is built with Tailwind CSS for a modern, responsive design that works on all devices.
- **Real-time Feedback**: Provides users with clear loading states and progress messages during the parsing process.

## How It Works

The application follows a sophisticated workflow to ensure high accuracy even with complex documents:

1.  **File Upload**: The user uploads a credit card statement in PDF format.
2.  **PDF-to-Image Conversion**: Instead of just extracting raw text (which would fail on scanned documents), the application uses `pdf.js` to render each page of the PDF into a high-quality JPEG image directly in the browser.
3.  **Multimodal Prompting**: These images are then sent to the Google Gemini API as part of a multimodal prompt. The prompt instructs the AI to analyze the images and identify specific financial details.
4.  **AI Analysis & Data Extraction**: Gemini processes the images, performing advanced Optical Character Recognition (OCR) and layout analysis to locate the required information. It uses a predefined JSON schema to structure its findings.
5.  **Display Results**: The structured JSON data returned by the API is then parsed and displayed to the user in a clean, easy-to-read format.

## Extracted Data Points

The application is configured to extract the following 5 key pieces of information:

1.  **Issuer Name**: The name of the bank or financial institution (e.g., "Chase", "American Express").
2.  **Card Last Four**: The last four digits of the credit card number.
3.  **Statement Period**: The billing cycle for the statement (e.g., "01/01/2024 - 01/31/2024").
4.  **Payment Due Date**: The final date by which payment must be made.
5.  **Total Amount Due**: The new balance or total amount owed for the period.

## Technology Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Engine**: Google Gemini API (`@google/genai`)
-   **PDF Processing**: PDF.js (`pdfjs-dist`)

This combination of technologies creates a powerful, client-side solution for intelligent document analysis.
