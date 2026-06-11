import asyncio
from typing import List, Dict, Any
from app.models.schemas import RequirementItem, UserStoryItem, AcceptanceCriteria

class AIService:
    async def summarize_text(self, text: str, style: str = "bullet", length: str = "medium") -> str:
        await asyncio.sleep(0.6)
        words = len(text.split())
        
        if style == "paragraph":
            if length == "short":
                return f"This document contains approximately {words} words of text. The core theme centers on automated document extraction and token usage optimization. It explains how raw input streams are converted to pristine markdown layouts, showing standard LLM estimation structures."
            return (
                f"### Key Document Overview\n\n"
                f"This document comprises {words} words of extracted text. The primary scope covers document preprocessing for Large Language Models. "
                f"It details processes for removing boilerplate layout noise, collapsing runs of whitespace, and formatting plain output text. "
                f"By applying structured parsing tools (like Microsoft MarkItDown), it translates complex layouts into standard representations. "
                f"This enables downstream models to ingest the data efficiently, reducing token footprints by up to 40% and cutting inference costs."
            )
        
        bullet_count = 3 if length == "medium" else (2 if length == "short" else 5)
        bullets = [
            f"**Document Structure**: Extracted source text has {words} words, processed successfully via MarkItDown.",
            "**Token Compression**: Removes blank runs, decorative tables, and unicode space sequences to minimize context footprint.",
            "**Downstream Integration**: Prepares clean, plain text and markdown suited for RAG pipelines or prompt injection.",
            "**Cost Savings**: Trims token counts by ~30-40% on average, leading to direct savings in LLM inference costs.",
            "**Formatting Preservation**: Keeps structural markdown elements (like list bullet symbols and links) intact for layout preservation."
        ]
        return "\n".join([f"- {b}" for b in bullets[:bullet_count]])

    async def analyze_brd(self, text: str) -> Dict[str, Any]:
        await asyncio.sleep(0.8)
        
        requirements = [
            RequirementItem(
                id="REQ-001",
                title="Strict File Verification",
                description="The backend must validate uploaded document headers against their magic signatures to block extension-spoofing attacks.",
                category="Security",
                priority="High"
            ),
            RequirementItem(
                id="REQ-002",
                title="Token Footprint Optimization",
                description="The platform must strip double-spaces, trailing spaces, and redundant blank rows to compress LLM token usage.",
                category="Functional",
                priority="High"
            ),
            RequirementItem(
                id="REQ-003",
                title="Multi-Tokenizer Analytics",
                description="The UI must display estimated token values for GPT, Claude, and Gemini model families side by side.",
                category="Functional",
                priority="Medium"
            ),
            RequirementItem(
                id="REQ-004",
                title="Denial-of-Service Size Guards",
                description="File sizes must be checked mid-stream, aborting transfers exceeding 10MB to maintain server stability.",
                category="Technical",
                priority="High"
            )
        ]
        
        summary = (
            "The document describes the core architecture for TokenSave, focusing on secure, fast, and light "
            "document extraction, estimation metrics, and AI readiness hooks. It demands a highly clean UI "
            "with solid error handling and zero persistent document storage."
        )
        
        return {
            "requirements": requirements,
            "summary": summary
        }

    async def generate_user_stories(self, text: str) -> List[UserStoryItem]:
        await asyncio.sleep(1.0)
        
        return [
            UserStoryItem(
                id="US-001",
                title="Drag & Drop Document Upload",
                as_a="Content Editor or Developer",
                i_want_to="drag a document onto a central drop zone",
                so_that="I can quickly upload and inspect its content without browsing file menus",
                acceptance_criteria=[
                    AcceptanceCriteria(
                        scenario="Dragging a valid file format",
                        given="I am on the Converter page",
                        when="I hover a PDF file over the drop zone",
                        then="The drop zone borders animate and show an 'active' state"
                    ),
                    AcceptanceCriteria(
                        scenario="Dropping an invalid format",
                        given="I have dragged an executable file (.exe)",
                        when="I drop it onto the area",
                        then="An error toast appears, and the upload does not progress"
                    )
                ],
                uat_test_cases=[
                    "Validate dragover class toggling on browser UI.",
                    "Verify file formats list is correctly parsed from drag events."
                ]
            ),
            UserStoryItem(
                id="US-002",
                title="Token and Cost Analytics",
                as_a="Inference Budget Administrator",
                i_want_to="compare token counts across different model families",
                so_that="I can estimate costs before running large prompt batches",
                acceptance_criteria=[
                    AcceptanceCriteria(
                        scenario="Estimates are computed",
                        given="I successfully converted a 50KB DOCX file",
                        when="The metrics dashboard renders",
                        then="I see character count, word count, line count, and GPT/Claude/Gemini estimates"
                    )
                ],
                uat_test_cases=[
                    "Compare token numbers against a tiktoken offline run to verify math accuracy.",
                    "Verify line count matches standard newline splits."
                ]
            )
        ]

ai_service = AIService()
