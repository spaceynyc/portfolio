import bpy, sys
sys.path.insert(0, 'C:/Users/srich/AppData/Roaming/Blender Foundation/Blender/4.5/scripts/addons')
import addon
addon.register()
bpy.ops.blendermcp.start_server()
print('SPACEYNYC_BLENDER_MCP_READY', flush=True)
