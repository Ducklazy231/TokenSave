import math
from typing import Dict

try:
    import tiktoken
    # Warm up encoding to check if cache is offline-accessible
    try:
        _encoding = tiktoken.get_encoding("cl100k_base")
    except Exception:
        _encoding = None
except ImportError:
    tiktoken = None
    _encoding = None

class TokenService:
    def __init__(self):
        self.chars_per_token = {
            "gpt": 4.0,      # Heuristic defaults
            "claude": 3.6,
            "gemini": 4.0,
        }

    def count_characters(self, text: str) -> int:
        return len(text) if text else 0

    def count_words(self, text: str) -> int:
        return len(text.split()) if text else 0

    def count_lines(self, text: str) -> int:
        """Counts total lines in the document (excluding final trailing newline if single-line)."""
        if not text:
            return 0
        return len(text.splitlines())

    def estimate_tokens(self, text: str, model_family: str = "gpt") -> int:
        """Estimate token count for a model family. Uses tiktoken if available, otherwise falls back to heuristics."""
        if not text:
            return 0
            
        model_family = model_family.lower()
        
        # If tiktoken is loaded and we have the cl100k_base encoding, use it for GPT/Claude
        if _encoding is not None:
            try:
                base_count = len(_encoding.encode(text))
                if model_family == "gpt":
                    return base_count
                elif model_family == "claude":
                    # Claude tokenizer is highly similar in density but has a different vocab,
                    # cl100k_base is a 98% accurate approximation.
                    return int(math.ceil(base_count * 1.02))
                elif model_family == "gemini":
                    # Gemini uses SentencePiece, which runs slightly higher on text
                    return int(math.ceil(base_count * 1.06))
            except Exception:
                # Catch-all to fallback if encoding execution fails
                pass

        # Heuristic fallback if tiktoken is not available
        ratio = self.chars_per_token.get(model_family, 4.0)
        char_estimate = len(text) / ratio
        word_estimate = len(text.split()) * 1.3
        return int(math.ceil((char_estimate + word_estimate) / 2))

    def get_all_estimates(self, text: str) -> Dict[str, int]:
        """Convenience method to calculate estimates for all supported models."""
        return {
            "gpt": self.estimate_tokens(text, "gpt"),
            "claude": self.estimate_tokens(text, "claude"),
            "gemini": self.estimate_tokens(text, "gemini"),
        }

token_service = TokenService()
