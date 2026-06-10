from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UploadResponse(BaseModel):
    filename: str = Field(..., description="The name of the processed file")
    text: str = Field(..., description="Cleaned extraction plain text")
    markdown: str = Field(..., description="Extracted Markdown document")
    word_count: int = Field(..., description="Total count of words in the extracted text")
    character_count: int = Field(..., description="Total characters in the extracted text")
    line_count: int = Field(..., description="Total line count of the extracted text")
    estimated_tokens: int = Field(..., description="Estimated GPT token usage")
    
    # Tokenizer specific breakdowns
    estimated_tokens_gpt: int = Field(..., description="Token count estimated for GPT models")
    estimated_tokens_claude: int = Field(..., description="Token count estimated for Claude models")
    estimated_tokens_gemini: int = Field(..., description="Token count estimated for Gemini models")
    
    # Compression metrics
    optimized_text: str = Field(..., description="White-space and noise optimized output")
    optimized_tokens: int = Field(..., description="Token count for optimized text")
    saved_tokens: int = Field(..., description="Tokens saved by optimization")
    saving_percentage: float = Field(..., description="Percentage of tokens saved")
    
    # Processing metrics
    file_size_bytes: int = Field(..., description="Size of the uploaded file in bytes")
    processing_time_sec: float = Field(..., description="Time taken to extract and process the file (seconds)")
    extraction_status: str = Field(..., description="Status of the extraction (success, warning, etc.)")


# Future AI Integrations

class AISummaryRequest(BaseModel):
    text: str = Field(..., description="The document text to summarize")
    style: str = Field("bullet", description="Style of the summary: bullet or paragraph")
    length: str = Field("medium", description="Length: short, medium, long")

class AISummaryResponse(BaseModel):
    summary: str = Field(..., description="The generated summary")
    estimated_tokens: int = Field(..., description="Tokens consumed by summary text")
    processing_time_sec: float = Field(..., description="Processing time in seconds")


class AIBrdRequest(BaseModel):
    text: str = Field(..., description="The business requirement document text")

class RequirementItem(BaseModel):
    id: str = Field(..., description="Requirement identifier (e.g. REQ-001)")
    title: str = Field(..., description="Brief title of the requirement")
    description: str = Field(..., description="Detailed description")
    category: str = Field(..., description="Category: Functional, Non-Functional, Technical")
    priority: str = Field(..., description="Priority: High, Medium, Low")

class AIBrdResponse(BaseModel):
    requirements: List[RequirementItem] = Field(..., description="List of extracted requirements")
    summary: str = Field(..., description="Overview of the business context")
    processing_time_sec: float = Field(..., description="Processing time in seconds")


class AIUserStoryRequest(BaseModel):
    text: str = Field(..., description="Text source to generate user stories from")

class AcceptanceCriteria(BaseModel):
    scenario: str = Field(..., description="Scenario description")
    given: str = Field(..., description="Given preconditions")
    when: str = Field(..., description="When action is taken")
    then: str = Field(..., description="Then postconditions")

class UserStoryItem(BaseModel):
    id: str = Field(..., description="Story identifier (e.g. US-001)")
    title: str = Field(..., description="Title of the user story")
    as_a: str = Field(..., description="User role (As a...)")
    i_want_to: str = Field(..., description="Objective (I want to...)")
    so_that: str = Field(..., description="Value statement (So that...)")
    acceptance_criteria: List[AcceptanceCriteria] = Field(..., description="List of acceptance criteria")
    uat_test_cases: List[str] = Field(..., description="Suggested UAT Test Cases")

class AIUserStoryResponse(BaseModel):
    user_stories: List[UserStoryItem] = Field(..., description="Generated user stories and test suites")
    processing_time_sec: float = Field(..., description="Processing time in seconds")
