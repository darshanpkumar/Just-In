import cv2
import face_recognition
import numpy as np


def detect_face(image_path: str) -> bool:
    try:
        # Load image via OpenCV
        img = cv2.imread(image_path)
        if img is None:
            return False

        # Convert BGR to RGB
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect face locations
        locations = face_recognition.face_locations(rgb_img)

        print(f"\n🔍 [AI DEBUG] Faces detected in {image_path}: {len(locations)}\n")

        return len(locations) == 1
    except Exception as e:
        print(f"❌ [AI DEBUG] Error during face detection: {e}")
        return False