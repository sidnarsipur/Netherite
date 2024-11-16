import { db, pc, model, index} from "@/app/lib/init";
import { BlocksByID } from "@/app/lib/dataStore";

export async function POST(req: Request){
    try{
        const { query, numResults } = await req.json();

        const queryEmbedding = await pc.inference.embed(
            model,
            [query],
            { inputType: 'query' }
          );

        const queryResponse = await index.namespace("namespace").query({
            topK: numResults,
            vector: queryEmbedding[0].values as number[],
            includeValues: false,
            includeMetadata: true
          });

        const blockIDs: string[] = [];

        queryResponse.matches.forEach(match => {
            blockIDs.push(match.id);
        })

        const blocks = await BlocksByID(blockIDs);
        
        return Response.json({ blocks: blocks });
    }

    catch(error){
        return new Response(JSON.stringify({ message: 'Failed to get search results', error: error.message }), { status: 500 });
    }
}