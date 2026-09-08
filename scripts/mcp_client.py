"""Use the installed Blender MCP server through the official MCP Python client."""
import asyncio, json, os, sys
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    params = StdioServerParameters(command='C:/Users/srich/.local/bin/blender-mcp.exe', env={**os.environ, 'DISABLE_TELEMETRY':'true', 'PYTHONIOENCODING':'utf-8'})
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            if len(sys.argv) == 1:
                result = await session.list_tools()
                print(json.dumps([{'name': t.name, 'inputSchema': t.inputSchema} for t in result.tools if t.name in ('get_scene_info','execute_blender_code','get_viewport_screenshot')], indent=2))
            else:
                code = Path(sys.argv[1]).read_text(encoding='utf-8')
                result = await session.call_tool('execute_blender_code', {'code':code})
                for c in result.content:
                    if c.type == 'text': print(c.text)

asyncio.run(main())
