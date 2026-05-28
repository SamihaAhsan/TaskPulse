import os
import uuid
import chromadb
from typing import Optional

CHROMA_PATH       = os.environ.get("CHROMA_PATH", "./chroma_db")
CHROMA_COLLECTION = os.environ.get("CHROMA_COLLECTION", "knowledge")

_client = chromadb.Client()

def _get_collection(name=None):
    return _client.get_or_create_collection(name=name or CHROMA_COLLECTION)

def _get_collection(name=None):
    return _client.get_or_create_collection(name=name or CHROMA_COLLECTION, embedding_function=_ef)

def chroma_search(query: str, top_k: int = 5, collection=None) -> list[dict]:
    """Semantic search over the local ChromaDB knowledge base."""
    col     = _get_collection(collection)
    results = col.query(query_texts=[query], n_results=top_k)
    docs, ids, distances, metas = (
        results["documents"][0], results["ids"][0],
        results["distances"][0], results["metadatas"][0]
    )
    return [{"doc_id": ids[i], "text": docs[i], "score": round(1 - distances[i], 4),
             "source": metas[i].get("source", "unknown")} for i in range(len(docs))]

def chroma_add_document(text: str, source: str, doc_id=None, collection=None, metadata=None) -> dict:
    """Add a document chunk to the ChromaDB knowledge base."""
    import uuid
    col = _get_collection(collection)
    _id = doc_id or str(uuid.uuid4())
    col.add(documents=[text], ids=[_id], metadatas=[{"source": source, **(metadata or {})}])
    return {"doc_id": _id, "source": source}

def chroma_get_document(doc_id: str, collection=None) -> dict:
    """Retrieve a specific document by ID from ChromaDB."""
    col    = _get_collection(collection)
    result = col.get(ids=[doc_id], include=["documents", "metadatas"])
    if not result["documents"]:
        raise ValueError(f"Document '{doc_id}' not found.")
    return {"doc_id": doc_id, "text": result["documents"][0], "metadata": result["metadatas"][0]}

def chroma_delete_document(doc_id: str, collection=None) -> dict:
    """Delete a document from ChromaDB by ID."""
    _get_collection(collection).delete(ids=[doc_id])
    return {"deleted": doc_id}

def chroma_list_collections() -> list[str]:
    """List all collection names in the local ChromaDB instance."""
    return [c.name for c in _client.list_collections()]

CHROMA_TOOLS = {
    "chroma_search":           chroma_search,
    "chroma_add_document":     chroma_add_document,
    "chroma_get_document":     chroma_get_document,
    "chroma_delete_document":  chroma_delete_document,
    "chroma_list_collections": chroma_list_collections,
}