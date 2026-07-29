import pickle
from app.ai.detector import detect_face
from app.ai.encoder import generate_face_encoding


def save_face_encoding(image_path: str, encoding_path: str) -> bool:
    # 1. Check single face detection
    if not detect_face(image_path):
        return False

    # 2. Generate 128-d encoding
    encoding = generate_face_encoding(image_path)

    if encoding is None:
        return False

    # 3. Save pickle file
    with open(encoding_path, "wb") as file:
        pickle.dump(encoding, file)

    return True