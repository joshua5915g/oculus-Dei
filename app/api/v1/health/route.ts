import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "operational",
    model_loaded: true,
    device: "edge-v8",
    version: "1.0.0",
  });
}
