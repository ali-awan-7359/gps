import cv2
import dlib
import numpy as np
import pandas as pd
from math import hypot

# Initialize dlib's face detector (HOG-based) and the facial landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# Initialize video capture
cap = cv2.VideoCapture(0)

# Create DataFrame to store coordinates
columns = ["Frame", "LPX", "LPY", "RPX", "RPY"]
data = {"Frame": [], "LPX": [], "LPY": [], "RPX": [], "RPY": []}
df = pd.DataFrame(data, columns=columns)

frame_count = 0


def midpoint(p1, p2):
    return int((p1.x + p2.x) / 2), int((p1.y + p2.y) / 2)


def get_pupil_coordinates(eye_points, facial_landmarks, gray_frame):
    eye_region = np.array(
        [
            (
                facial_landmarks.part(eye_points[0]).x,
                facial_landmarks.part(eye_points[0]).y,
            ),
            (
                facial_landmarks.part(eye_points[1]).x,
                facial_landmarks.part(eye_points[1]).y,
            ),
            (
                facial_landmarks.part(eye_points[2]).x,
                facial_landmarks.part(eye_points[2]).y,
            ),
            (
                facial_landmarks.part(eye_points[3]).x,
                facial_landmarks.part(eye_points[3]).y,
            ),
            (
                facial_landmarks.part(eye_points[4]).x,
                facial_landmarks.part(eye_points[4]).y,
            ),
            (
                facial_landmarks.part(eye_points[5]).x,
                facial_landmarks.part(eye_points[5]).y,
            ),
        ],
        np.int32,
    )

    min_x = np.min(eye_region[:, 0])
    max_x = np.max(eye_region[:, 0])
    min_y = np.min(eye_region[:, 1])
    max_y = np.max(eye_region[:, 1])

    eye = gray_frame[min_y:max_y, min_x:max_x]
    _, threshold_eye = cv2.threshold(eye, 70, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(
        threshold_eye, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
    )

    if contours and len(contours) > 0:
        contours = sorted(contours, key=lambda x: cv2.contourArea(x), reverse=True)
        for cnt in contours:
            (x, y, w, h) = cv2.boundingRect(cnt)
            center_x = int(x + w / 2)
            center_y = int(y + h / 2)
            return center_x + min_x, center_y + min_y
    return None, None


while True:
    ret, frame = cap.read()
    frame_count += 1

    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = detector(gray)

    for face in faces:
        landmarks = predictor(gray, face)

        left_pupil_x, left_pupil_y = get_pupil_coordinates(
            (36, 37, 38, 39, 40, 41), landmarks, gray
        )
        right_pupil_x, right_pupil_y = get_pupil_coordinates(
            (42, 43, 44, 45, 46, 47), landmarks, gray
        )

        if left_pupil_x and left_pupil_y:
            cv2.circle(frame, (left_pupil_x, left_pupil_y), 2, (0, 255, 0), -1)
            df = pd.concat(
                [
                    df,
                    pd.DataFrame(
                        {
                            "Frame": [frame_count],
                            "LPX": [left_pupil_x],
                            "LPY": [left_pupil_y],
                            "RPX": [right_pupil_x],
                            "RPY": [right_pupil_y],
                        }
                    ),
                ],
                ignore_index=True,
            )

    cv2.imshow("Frame", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

print("DataFrame:")
print(df)

output_file_path = "eye_coordinates.xlsx"
df.to_excel(output_file_path, index=False)

print(f"Eye coordinates saved to {output_file_path}")
