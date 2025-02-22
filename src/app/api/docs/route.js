import { NextResponse } from "next/server";
import openapiSpecification from "../../../../swagger";

export function GET() {
  return NextResponse.json(openapiSpecification);
}
