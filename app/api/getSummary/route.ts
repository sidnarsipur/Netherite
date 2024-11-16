import { db, pc, model, index, sysPrompt} from "@/app/lib/init";
import { BlocksByID } from "@/app/lib/dataStore";
import { google } from "@/app/lib/init";
import { generateText } from 'ai';

export async function POST(req: Request){
    try{
        const { blockText } = await req.json();

        const union = blockText.join('\nNEW NOTE\n')

        const { text } = await generateText({
            model: google('gemini-1.5-pro-latest'),
            system: sysPrompt,
            prompt: union,
        });

        return Response.json({ summary: text });
    }

    catch(error){
        return new Response(JSON.stringify({ message: 'Failed to get summary', error: error.message }), { status: 500 });
    }
}