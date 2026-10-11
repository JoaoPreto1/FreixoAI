
def split_text(
    text: str,
    chunk_size: int = 1200,
    overlap: int = 200,
) -> list[str]:
    text = " ".join(text.split())

    if not text:
        return []

    if overlap >= chunk_size:
        raise ValueError("O overlap deve ser inferior ao tamanho do fragmento.")

    chunks = []
    start = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))

        if end < len(text):
            boundary = text.rfind(" ", start, end)

            if boundary > start:
                end = boundary

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(text):
            break

        start = end - overlap

    return chunks