"""Embedding generation using Anthropic API."""

import hashlib
from anthropic import Anthropic
from cli.settings import settings


class AnthropicEmbedder:
    """Generate embeddings using Anthropic API."""

    def __init__(self):
        """Initialize embedder with API client."""
        self._client = Anthropic(api_key=settings.anthropic_api_key)

    def embed(self, text: str) -> list[float]:
        """
        Embed a single text.

        Args:
            text: Text to embed

        Returns:
            Embedding vector
        """
        # TODO: Implement actual API call when endpoint available
        # For now, return mock embedding
        return [0.0] * 768

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """
        Embed multiple texts.

        Args:
            texts: List of texts to embed

        Returns:
            List of embedding vectors
        """
        return [self.embed(text) for text in texts]

    def _cache_key(self, content: str) -> str:
        """
        Generate cache key for content.

        Args:
            content: Content to hash

        Returns:
            SHA256 hex digest
        """
        return hashlib.sha256(content.encode()).hexdigest()
