"""Build the four service symbols through Blender MCP; save editable 3D source."""
import bpy, math
from pathlib import Path

ROOT=Path('C:/Users/srich/Downloads/neo-porfolio')
# Reuse the sculpting and studio-lighting functions, before the project scenes.
exec((ROOT/'scripts/create_assets.py').read_text().split('nexus=[]')[0],globals())

def prism(obj,size):
    colors=obj.data.color_attributes.new(name='Prism',type='FLOAT_COLOR',domain='CORNER')
    palette=[(.22,.35,1),(.35,.85,1),(.91,.95,1),(.91,.57,1),(.52,.42,1)]
    for loop in obj.data.loops:
        co=obj.data.vertices[loop.vertex_index].co
        t=max(0,min(.999,(co.x/size*.45+co.z/size*.45+.5)))*(len(palette)-1)
        i=int(t);f=t-i
        color=tuple(palette[i][j]*(1-f)+palette[i+1][j]*f for j in range(3))
        colors.data[loop.index].color=(*color,1)
    return obj

node=pearl.node_tree.nodes.new('ShaderNodeVertexColor');node.layer_name='Prism'
pearl.node_tree.links.new(node.outputs['Color'],pearl.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])

def icon_stage(name,objects,ortho=2.8):
    scene=stage(name,objects,(0,-8,1.2),ortho=ortho)
    scene.render.resolution_x=512;scene.render.resolution_y=512;scene.cycles.samples=64
    return scene

brand=[prism(star('Brand / four-point prism',(0,0,0),.9),.9)]
scenes=[icon_stage('brand-icon',brand,2.75)]
bpy.ops.scene.new(type='NEW')
digital=[ring('Digital / polished world',1.02,.66,.046,silver,rot=(1.17,-.60,0)),ring('Digital / blue orbital',1.18,.53,.038,blue,rot=(1.30,-.22,.1)),ring('Digital / silver orbital rim',1.18,.53,.018,silver,loc=(0,-.015,.012),rot=(1.30,-.22,.1))]
scenes.append(icon_stage('digital-icon',digital,2.8))
bpy.ops.scene.new(type='NEW')
content=[prism(star('Content / main star',(-.26,0,-.02),.8),.8),prism(star('Content / upper satellite',(.68,0,.65),.27),.27),prism(star('Content / lower satellite',(.72,0,-.51),.21),.21)]
scenes.append(icon_stage('content-icon',content,2.75))
bpy.ops.scene.new(type='NEW')
experience=[ring('Experience / inclined orbit',1.02,.53,.045,silver,rot=(1.25,-.60,0)),ring('Experience / violet edge',1.04,.53,.022,blue,rot=(1.25,-.60,0)),prism(star('Experience / north star',(-.38,-.30,.69),.35),.35)]
scenes.append(icon_stage('experience-icon',experience,2.7))
bpy.context.window.scene=scenes[0]
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/'spaceynyc-service-icons.blend'))
queue=list(scenes)
def render_icons():
    if not queue:
        (OUT/'icons-complete.txt').write_text('Four original service icons modeled and rendered with Blender MCP.')
        return None
    scene=queue.pop(0);bpy.context.window.scene=scene
    bpy.ops.render.render(write_still=True,scene=scene.name)
    return .5
bpy.app.timers.register(render_icons,first_interval=1)
print('Four service icons modeled, exported as GLB and saved as .blend. Rendering transparent posters.')
