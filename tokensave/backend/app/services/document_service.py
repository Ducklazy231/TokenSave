import os
import re
import tempfile
from fastapi import HTTPException, status

try:
    from markitdown import MarkItDown
except ImportError:
    MarkItDown = None

class DocumentService:
    def __init__(self):
        # Initialize MarkItDown parser. If markitdown is not available, we handle it gracefully.
        self._parser = None
        if MarkItDown is not None:
            try:
                self._parser = MarkItDown(enable_plugins=False)
            except Exception:
                pass

    def get_parser(self) -> MarkItDown:
        if self._parser is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Microsoft MarkItDown is not loaded or installed. Ensure markitdown package is properly configured."
            )
        return self._parser

    def convert_to_markdown(self, file_content: bytes, extension: str) -> str:
        """Writes bytes to a safe temporary file, runs MarkItDown, and cleans up immediately."""
        parser = self.get_parser()
        
        # Write file content to a temporary file
        temp_fd, temp_path = tempfile.mkstemp(suffix=extension)
        try:
            with os.fdopen(temp_fd, 'wb') as tmp:
                tmp.write(file_content)
                
            # Perform conversion
            result = parser.convert(temp_path)
            return result.text_content or ""
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to parse document: {str(e)}"
            )
        finally:
            # Absolute cleanup guarantee
            if os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                except OSError:
                    pass

    def markdown_to_plain_text(self, markdown_text: str) -> str:
        """Strip markdown specific tokens to yield readable plain text."""
        if not markdown_text:
            return ""
            
        text = markdown_text
        # Remove fenced code block markers but keep content.
        text = re.sub(r"```[a-zA-Z0-9]*\n", "", text)
        text = text.replace("```", "")
        # Images: ![alt](url) -> alt
        text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
        # Links: [text](url) -> text
        text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
        # Headings, blockquotes, list bullets.
        text = re.sub(r"^\s{0,3}#{1,6}\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"^\s{0,3}>\s?", "", text, flags=re.MULTILINE)
        text = re.sub(r"^\s*[-*+]\s+", "", text, flags=re.MULTILINE)
        # Bold / italic / inline code markers.
        text = re.sub(r"(\*\*|__|\*|_|`)", "", text)
        # Table pipes.
        text = text.replace("|", " ")
        return text.strip()

    def optimize_text(self, text: str) -> str:
        """Shrink text layout size in tokens losslessly for LLM feeding."""
        if not text:
            return ""

        # Normalize unicode spaces and tabs
        text = text.replace("\u00a0", " ").replace("\t", " ")
        text = text.replace("\r\n", "\n").replace("\r", "\n")

        lines = text.split("\n")
        cleaned = []
        for line in lines:
            # Collapse multiple spaces
            line = re.sub(r"[ ]{2,}", " ", line).rstrip()
            # Drop purely decorative divider lines
            if re.fullmatch(r"[-=_*~]{3,}", line.strip()):
                continue
            cleaned.append(line)

        # Collapse excessive blank lines
        result_lines = []
        blank_run = 0
        for line in cleaned:
            if line.strip() == "":
                blank_run += 1
                if blank_run >= 2:
                    continue
                result_lines.append("")
            else:
                blank_run = 0
                result_lines.append(line)

        return "\n".join(result_lines).strip()

document_service = DocumentService()
