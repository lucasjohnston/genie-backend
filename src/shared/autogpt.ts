import { AutoGPT as SourceGPT } from 'langchain-gpt4all/experimental/autogpt'
import { ReadFileTool, WriteFileTool, SerpAPI } from 'langchain-gpt4all/tools'
// import { VectorStoreRetrieverMemory } from 'langchain-gpt4all/memory'
import { NodeFileStore } from 'langchain-gpt4all/stores/file/node'
import { OpenAIEmbeddings } from 'langchain-gpt4all/embeddings/openai'
import { ChatOpenAI } from 'langchain-gpt4all/chat_models/openai'
import { Milvus } from 'langchain-gpt4all/vectorstores/milvus'
import { DataType, MilvusClient } from '@zilliz/milvus2-sdk-node/dist/milvus'

class AutoGPT {
  vectorStore: Milvus
  store: NodeFileStore
  tools: [ReadFileTool, WriteFileTool, SerpAPI]
  instance: SourceGPT

  // Async constructor pattern to establish connection to Pinecone
  static async init(collectionName: string, aiName: string, aiRole: string) {
    let vectorStore: Milvus
    try {
      vectorStore = await Milvus.fromExistingCollection(
        new OpenAIEmbeddings(),
        {
          collectionName,
        },
      )
    } catch (e: any) {
      const error = e.toString()
      if (error.includes('Collection not found')) {
        const res = await new MilvusClient('localhost:19530').createCollection({
          collection_name: collectionName,
          fields: [
            {
              name: 'id',
              data_type: DataType.Int64,
              autoID: true,
              is_primary_key: true,
              description: '',
            },
            {
              name: 'vector_01',
              description: 'vector field',
              data_type: DataType.FloatVector,
              type_params: {
                dim: '1536',
              },
            },
            {
              name: 'thoughts',
              data_type: DataType.VarChar,
              description: '',
              max_length: '1024',
            },
          ],
        })
        await new MilvusClient('localhost:19530').createIndex({
          collection_name: collectionName,
          field_name: 'vector_01',
          index_type: 'HNSW',
          metric_type: 'L2',
          params: {
            M: 32,
            efConstruction: 200,
          },
        })
        console.log('Created collection with index', res)
        vectorStore = await Milvus.fromExistingCollection(
          new OpenAIEmbeddings(),
          {
            collectionName,
          },
        )
      } else {
        throw error
      }
    }

    return new AutoGPT(vectorStore, aiName, aiRole).get()
  }

  constructor(vectorStore: Milvus, aiName: string, aiRole: string) {
    this.vectorStore = vectorStore
    this.store = new NodeFileStore()
    this.tools = [
      new ReadFileTool({ store: this.store }),
      new WriteFileTool({ store: this.store }),
      new SerpAPI(),
    ]
    this.instance = SourceGPT.fromLLMAndTools(
      new ChatOpenAI({ temperature: 0 }), // TOOO: Implement Gpt4ALl-J with chat for this
      this.tools,
      {
        memory: this.vectorStore.asRetriever(),
        aiName,
        aiRole,
      },
    )
  }

  get() {
    return this.instance
  }
}

export default AutoGPT
