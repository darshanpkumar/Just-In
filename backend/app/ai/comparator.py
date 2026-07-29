import pickle
import face_recognition


def compare_faces(image_path, encoding_path):

    image = face_recognition.load_image_file(image_path)

    uploaded = face_recognition.face_encodings(image)

    if not uploaded:
        return False

    with open(encoding_path, "rb") as f:
        stored = pickle.load(f)

    return face_recognition.compare_faces(
        [stored],
        uploaded[0]
    )[0]