import chromadb

# Initialize the persistent client, specifying a folder path for storage
client = chromadb.PersistentClient(path="./chroma_storage")

# Create or get a collection (stored on disk now)
collection = client.create_collection(name="my_persistent_collection")

# Add embeddings to the collection
collection.add(
    embeddings=[[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
    ids=["doc1", "doc2"],
    metadatas=[{"category": "science"}, {"category": "tech"}],
    documents=["Document about science", "Document about technology"]
)

# Query the collection (data is stored on disk)
results = collection.query(
    query_embeddings=[[0.1, 0.2, 0.3]],
    n_results=2
)

print(results)
