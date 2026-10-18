import { makeRouteHandler } from "@keystatic/next/route-handler";
import { editorAvailable } from "@/lib/family-gate";
import config from "../../../../keystatic.config";

const handler = makeRouteHandler({ config });
type Req = Parameters<typeof handler.GET>[0];
const closed = () => new Response("Not found", { status: 404 });

// The editor API is closed in production until GitHub sign-in is configured.
export const GET = async (req: Req) => (editorAvailable() ? handler.GET(req) : closed());
export const POST = async (req: Req) => (editorAvailable() ? handler.POST(req) : closed());
