"""Executed inside Blender by execute_blender_code through Blender MCP.

Creates editable black-chrome cubes, orbital sculpture and flowing chrome ribbons.
The supplied reference artwork stays in the landing composition; these original
models power the interactive project views and are delivered as .blend and .glb.
"""
import bpy, math, random
from pathlib import Path
from mathutils import Vector

ROOT=Path('C:/Users/srich/Downloads/neo-porfolio')
OUT=ROOT/'public/assets'
SOURCE=ROOT/'blender'
SOURCE.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for scene in list(bpy.data.scenes):
    if scene != bpy.context.scene: bpy.data.scenes.remove(scene)

def material(name, color, rough=.1, metal=1):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    p.inputs['Coat Weight'].default_value=.35;p.inputs['Coat Roughness'].default_value=.07
    return m

black=material('Obsidian / polished black chrome',(.105,.11,.14),.065)
silver=material('Mirror / cool platinum',(.68,.71,.85),.105)
blue=material('Orbit / spectral blue',(.10,.17,.9),.13)
pearl=material('Star / iridescent titanium',(.52,.65,.95),.17)
p=pearl.node_tree.nodes.get('Principled BSDF')
if 'Thin Film Thickness' in p.inputs:
    p.inputs['Thin Film Thickness'].default_value=420
    p.inputs['Thin Film IOR'].default_value=1.38

def cube(loc, scale, rotation):
    bpy.ops.mesh.primitive_cube_add(size=2,location=loc)
    obj=bpy.context.object;obj.name='Nexus / beveled obsidian cube';obj.scale=(scale,)*3
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.rotation_euler=rotation;obj.data.materials.append(black)
    bevel=obj.modifiers.new('Precision polished edges','BEVEL');bevel.width=.13*scale;bevel.segments=6
    obj.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL')
    for poly in obj.data.polygons:poly.use_smooth=True
    return obj

def curve(name,points,radius,mat,closed=True):
    data=bpy.data.curves.new(name,'CURVE');data.dimensions='3D';data.resolution_u=2
    spline=data.splines.new('POLY');spline.points.add(len(points)-1)
    for p,co in zip(spline.points,points):p.co=(*co,1)
    spline.use_cyclic_u=closed;data.bevel_depth=radius;data.bevel_resolution=4
    obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);obj.data.materials.append(mat)
    return obj

def ring(name,a,b,radius,mat,loc=(0,0,0),rot=(0,0,0)):
    points=[(a*math.cos(i*math.tau/256),b*math.sin(i*math.tau/256),0) for i in range(256)]
    obj=curve(name,points,radius,mat);obj.location=loc;obj.rotation_euler=rot
    return obj

def star(name,location,size=1):
    verts=[];faces=[];n=128;layers=13
    # Four cusps, concave shoulders and a softly inflated mirrored surface.
    for j in range(layers):
        v=j/(layers-1);lat=math.pi*v;rad=math.sin(lat)
        for i in range(n):
            a=math.tau*i/n
            verts.append((size*rad*math.cos(a)**3,.18*size*math.cos(lat),1.15*size*rad*math.sin(a)**3))
    for j in range(layers-1):
        for i in range(n):
            k=j*n+i;l=j*n+(i+1)%n;faces.append((k,l,l+n,k+n))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);obj.location=location;obj.data.materials.append(pearl)
    for f in mesh.polygons:f.use_smooth=True
    return obj

def area(name,loc,energy,color,size,target=(0,0,0),shape='DISK',size_y=1):
    data=bpy.data.lights.new(name,'AREA');data.energy=energy;data.color=color;data.shape=shape;data.size=size
    if shape=='RECTANGLE':data.size_y=size_y
    obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);obj.location=loc
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()

def stage(name,objects,camera_pos,target=(0,0,0),ortho=9):
    for obj in bpy.context.selected_objects:obj.select_set(False)
    for obj in objects:obj.select_set(True)
    bpy.context.view_layer.objects.active=objects[0]
    bpy.ops.object.convert(target='MESH')
    # Export only sculpture objects; keep the lighting rig in the .blend source.
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')),use_selection=True,export_apply=True,export_yup=True)
    scene=bpy.context.scene;scene.name='Spaceynyc / '+name
    scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
    try:
        prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
        for d in prefs.devices:d.use=d.type!='CPU'
        scene.cycles.device='GPU'
    except Exception:pass
    scene.render.resolution_x=1100;scene.render.resolution_y=700;scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
    if not scene.world: scene.world=bpy.data.worlds.new('Studio / dark ambient')
    scene.world.color=(.035,.035,.045)
    scene.view_settings.view_transform='AgX'
    bpy.ops.object.camera_add(location=camera_pos)
    cam=bpy.context.object;cam.name='Camera / '+name;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=ortho;scene.camera=cam
    area('Key / broad silver softbox',(-3,-4,6),1800,(.91,.94,1),5)
    area('Rim / narrow silver strip',(4,1,4),2300,(.88,.89,1),5,shape='RECTANGLE',size_y=.6)
    area('Edge / violet reflection',(-4,2,1),1500,(.35,.24,1),4,shape='RECTANGLE',size_y=1.5)
    area('Edge / ice blue',(3,-3,-2),1800,(.3,.64,1),3,shape='RECTANGLE',size_y=.4)
    area('Top / white reflection',(1,2,6),1600,(1,1,1),3)
    scene.render.filepath=str(OUT/(name+'.png'))
    return scene

nexus=[]
for loc,scale,rotation in [((-.1,0,1.45),1.04,(.20,-.28,.3)),((.40,-.2,-.7),1.05,(.25,.25,-.25)),((-1.7,.6,-.15),.74,(.55,.32,.5)),((1.8,.65,.3),.85,(.2,.5,.5)),((1.2,1.2,1.6),.62,(.4,.1,-.2)),((-1.1,1,-1.6),.65,(.3,-.3,.2))]:nexus.append(cube(loc,scale,rotation))
nexus.append(ring('Nexus / silver orbit',4.1,2.5,.029,silver,(0,0,.1),(.23,-.20,-.1)))
nexus.append(ring('Nexus / spectral edge',4.11,2.5,.012,blue,(0,0,.09),(.23,-.20,-.1)))
nexus.append(star('Nexus / guiding star',(3.2,-.2,1.9),.7))
scene1=stage('nexus',nexus,(7,-11,7),ortho=10.6)
bpy.ops.scene.new(type='NEW')
orbital=[ring('Orbital / polished equator',2.15,2.15,.075,silver,rot=(.9,.3,.15)),ring('Orbital / luminous orbit',2.65,2.0,.045,blue,rot=(.15,-.35,.1)),ring('Orbital / silver orbit edge',2.67,2.0,.018,silver,rot=(.15,-.35,.1)),star('Orbital / north star',(2.8,-.1,1.4),1.0)]
scene2=stage('orbital',orbital,(3,-9,5),ortho=9)
bpy.ops.scene.new(type='NEW')
chroma=[]
for j in range(68):
    points=[]
    for i in range(220):
        x=-4.8+9.6*i/219;y=(j-34)*.065
        z=.65*math.sin(x*1.0+y*.8)+.21*math.sin(x*1.9-y*1.2)+.08*math.cos(y*6+x)
        points.append((x,y,z))
    chroma.append(curve('Chroma / liquid filament %02d'%j,points,.025+(.012 if j%5==0 else 0),silver,False))
scene3=stage('chroma',chroma,(2,-8,7),ortho=11)
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/'spaceynyc-sculptures.blend'))

# Render asynchronously, allowing the MCP call to return before GPU work starts.
queue=[scene1,scene2,scene3]
def render_next():
    if not queue:
        (OUT/'render-complete.txt').write_text('Nexus, Orbital, Chroma rendered successfully through Blender MCP.')
        return None
    scene=queue.pop(0);bpy.context.window.scene=scene
    bpy.ops.render.render(write_still=True,scene=scene.name)
    return 1.0
bpy.app.timers.register(render_next,first_interval=2.0)
print('Created 3 custom sculptures, exported GLB models, saved editable Blender source. Render queue started.')
