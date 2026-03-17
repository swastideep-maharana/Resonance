import shutil
import os

src = r"h:\Projects(github)\Ai Voice Cloning Platform\resonance\public\icons8-audio-wave-96.png"
dst_icon = r"h:\Projects(github)\Ai Voice Cloning Platform\resonance\src\app\icon.png"
dst_fav = r"h:\Projects(github)\Ai Voice Cloning Platform\resonance\src\app\favicon.ico"

print(f"Starting script... src: {src}")

try:
    if os.path.exists(src):
        # Delete old favicon if it exists
        if os.path.exists(dst_fav):
            print("Deleting old favicon.ico")
            os.remove(dst_fav)
        
        # Copy to icon.png
        print("Copying to icon.png")
        shutil.copy(src, dst_icon)
        
        print("Done successfully.")
    else:
        print("Source file not found.")
except Exception as e:
    print(f"Error: {e}")
