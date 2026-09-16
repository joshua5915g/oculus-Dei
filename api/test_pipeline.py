import io
import numpy as np
import cv2
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_google_gemini_image():
    # Simulate Google Gemini Imagen 3 image with embedded C2PA/IPTC metadata
    img = Image.new("RGB", (1024, 1024), color=(140, 110, 80))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    # Append simulated C2PA / Gemini manifest marker as Google outputs
    raw_bytes = buf.getvalue() + b' <?xpacket> <Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType> jumb c2pa google imagen synthid '
    
    files = {"file": ("gemini_generated_photo.jpg", io.BytesIO(raw_bytes), "image/jpeg")}
    response = client.post("/api/v1/detect", files=files)
    assert response.status_code == 200, f"Error: {response.text}"
    data = response.json()

    print("[TEST GOOGLE GEMINI IMAGE]")
    print(f"  Filename: {data['filename']}")
    print(f"  Verdict: {data['verdict']}")
    print(f"  Fake Probability: {data['fake_probability'] * 100:.1f}%")
    print(f"  Prediction Label: {data['prediction_label']}")
    print(f"  Risk Level: {data['risk_level']}")
    print(f"  Artifact Reason: {data['xai']['detected_artifacts'][0]['description']}")
    assert data["verdict"] == "SYNTHETIC", f"Expected SYNTHETIC, got {data['verdict']}"
    assert data["fake_probability"] >= 0.90, f"Expected fake_prob >= 90%, got {data['fake_probability']}"
    print("  -> PASSED: Google Gemini image successfully flagged as SYNTHETIC!\n")

def test_authentic_camera_photo():
    # Real camera photo with authentic EXIF and natural gradients
    img = Image.new("RGB", (1920, 1080), color=(140, 160, 180))
    exif = img.getexif()
    exif[271] = "Apple"
    exif[272] = "iPhone 15 Pro"
    buf = io.BytesIO()
    img.save(buf, format="JPEG", exif=exif)
    buf.seek(0)

    files = {"file": ("IMG_7821.jpg", buf, "image/jpeg")}
    response = client.post("/api/v1/detect", files=files)
    assert response.status_code == 200
    data = response.json()

    print("[TEST AUTHENTIC CAMERA PHOTO]")
    print(f"  Filename: {data['filename']}")
    print(f"  Verdict: {data['verdict']}")
    print(f"  Fake Probability: {data['fake_probability'] * 100:.1f}%")
    print(f"  Prediction Label: {data['prediction_label']}")
    print(f"  Risk Level: {data['risk_level']}")
    assert data["verdict"] == "AUTHENTIC", f"Expected AUTHENTIC, got {data['verdict']}"
    assert data["fake_probability"] < 0.20
    print("  -> PASSED: Genuine camera photo verified as AUTHENTIC!\n")

if __name__ == "__main__":
    test_google_gemini_image()
    test_authentic_camera_photo()
    print("=== ALL TEST SCENARIOS PASSED WITH HIGH PRECISION ===")
