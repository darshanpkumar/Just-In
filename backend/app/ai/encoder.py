import cv2
import face_recognition


def generate_face_encoding(image_path: str):
    try:
        img = cv2.imread(image_path)
        if img is None:
            return None

        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(rgb_img)

        if len(encodings) > 0:
            return encodings[0]
        return None
    except Exception as e:
        print(f"❌ [AI DEBUG] Error generating encoding: {e}")
        return None