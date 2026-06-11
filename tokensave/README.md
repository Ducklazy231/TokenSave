# TokenSave

TokenSave is a web utility designed to convert raw document files into clean, AI-ready plain text and markdown representations while optimizing token usage for Large Language Models (LLMs).

## Why TokenSave?

Most document formats (like PDF, Word, PowerPoint, and Excel) contain complex formatting, style sheets, metadata, and visual structures. When passing these files directly to LLMs, this visual and formatting noise consumes a large portion of the model's context window and inflates API costs.

TokenSave solves this problem by extracting only the essential, structured text content and applying lossless optimization heuristics (such as collapsing repeated whitespace, blank lines, and pagination separators) to reduce token count without losing any semantic value.

## Features

- **High-Fidelity Text Extraction**: Uses Microsoft MarkItDown layout engines to extract structured plain text and markdown.
- **Smart Token Optimization**: Compares and optimizes original text against a clean, token-saving structure.
- **AI Compatibility Grid**: Real-time checking against context limits of common LLMs.
- **Smart Split Recommendations**: Generates logical partition recommendations if a document exceeds standard context windows.
- **Multi-File Batch Conversion**: Process and merge up to 5 documents simultaneously.
- **Fast Mode for spreadsheets**: Limits processing to the first 5,000 rows and skips visual styling to speed up large Excel files.

## Supported Files

TokenSave supports the following formats:
- **PDF** (Text-based)
- **Word** (.docx)
- **PowerPoint** (.pptx)
- **Excel** (.xlsx)
- **Plain Text** (.txt)
- **Web Pages** (.html, .htm)

## How It Works

1. **Upload**: Drag and drop or browse to select files.
2. **Convert**: Process the documents to run token statistics and savings estimation.
3. **Copy & Export**: Copy the optimized markdown or plain text, download files individually, or export split chunks as a ZIP archive.

## AI Compatibility

The application provides an informational compatibility grid showing whether the converted text fits inside the context windows of key models:
- **GPT-4o** (~128K tokens)
- **GPT-5.4** (~1M tokens)
- **Claude Sonnet** (~200K tokens)
- **Claude 4.6** (~1M tokens)
- **Gemini 2.5 Pro** (~2M tokens)
- **Gemini 3.x Pro** (~1M tokens)

If a document exceeds a model's limit, TokenSave recommends the number of split parts required and allows downloading the generated logical chunks.

## Privacy

Privacy is a core design principle:
- All file processing occurs temporarily in memory.
- Converted documents are never saved, cached, or permanently stored on disk.
- Document contents are not sent to any external AI APIs.

## Technology

- **Backend**: Python, FastAPI, Microsoft MarkItDown, openpyxl, tiktoken.
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, JSZip.
