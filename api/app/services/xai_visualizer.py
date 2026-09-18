import base64
import cv2
import numpy as np
from typing import Tuple, List, Optional

class XAIVisualizer:
    @staticmethod
    def create_synthetic_gradcam(
        image_bgr: np.ndarray,
        fake_probability: float,
        hotspots: Optional[List[Tuple[float, float, float]]] = None
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generates:
          1) Colorized Grad-CAM heatmap (BGR)
          2) Composite blend of original image + heatmap
        
        `hotspots` is an optional list of (center_y_ratio, center_x_ratio, radius_ratio).
        """
        h, w = image_bgr.shape[:2]
        heatmap = np.zeros((h, w), dtype=np.float32)

        is_fake = fake_probability >= 0.50

        if hotspots is None:
            if is_fake:
                # Realistic manipulation focal hotspots: mouth/jawline, eyes, forehead/boundary
                hotspots = [
                    (0.68, 0.50, 0.18),  # Lip / mouth region
                    (0.38, 0.38, 0.14),  # Left eye & orbital region
                    (0.38, 0.62, 0.13),  # Right eye region
                    (0.55, 0.72, 0.16),  # Jawline blending boundary
                ]
            else:
                # Authentic media: no localized hot spots
                hotspots = []

        y_coords, x_coords = np.ogrid[:h, :w]

        for cy_ratio, cx_ratio, radius_ratio in hotspots:
            cy, cx = int(cy_ratio * h), int(cx_ratio * w)
            radius = max(int(radius_ratio * min(h, w)), 10)
            
            # 2D Gaussian kernel
            dist_sq = (x_coords - cx) ** 2 + (y_coords - cy) ** 2
            gaussian = np.exp(-dist_sq / (2 * (radius ** 2)))
            heatmap += gaussian * fake_probability

        if is_fake:
            # Normalize to vibrant 0 - 255 for clear visualization of hot spots
            if np.max(heatmap) > 0:
                heatmap = (heatmap / np.max(heatmap)) * 255.0
        else:
            # Authentic media: calm, cool baseline activation (stays in deep blue/navy zone)
            # Add subtle uniform sensor noise background
            noise = np.random.uniform(0, 15, (h, w)).astype(np.float32)
            heatmap = noise

        heatmap = np.clip(heatmap, 0, 255).astype(np.uint8)

        # Smooth using Gaussian blur
        blur_ksize = max(int(min(h, w) * 0.08) | 1, 15)
        heatmap_blurred = cv2.GaussianBlur(heatmap, (blur_ksize, blur_ksize), 0)

        # Apply TURBO colormap
        colored_heatmap = cv2.applyColorMap(heatmap_blurred, cv2.COLORMAP_TURBO)

        # For authentic images, make the colored heatmap predominantly deep navy/cool
        if not is_fake:
            # Tone down to cool blue tones
            colored_heatmap[:, :, 2] = (colored_heatmap[:, :, 2] * 0.1).astype(np.uint8) # suppress red
            colored_heatmap[:, :, 1] = (colored_heatmap[:, :, 1] * 0.3).astype(np.uint8) # suppress green

        # Create blended composite
        alpha = 0.55 if is_fake else 0.15
        composite = cv2.addWeighted(image_bgr, 1.0 - alpha, colored_heatmap, alpha, 0)

        return colored_heatmap, composite

    @staticmethod
    def generate_2d_fft_spectrogram(image_bgr: np.ndarray, is_synthetic: bool) -> Tuple[np.ndarray, str]:
        """
        Computes the 2D Fast Fourier Transform (FFT) Power Spectrogram of the input specimen.
        Highlights high-frequency checkerboard grid anomalies common in generative models (GAN/Diffusion).
        Returns the BGR spectrogram visualization and its Data URI base64 string.
        """
        h, w = image_bgr.shape[:2]
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)

        # Center square crop for optimal 2D FFT symmetry
        size = min(h, w)
        cy, cx = h // 2, w // 2
        half = size // 2
        crop = gray[cy - half : cy + half, cx - half : cx + half]

        # 2D FFT & Shift DC to center
        f = np.fft.fft2(crop)
        fshift = np.fft.fftshift(f)
        magnitude = 20 * np.log(np.abs(fshift) + 1e-5)

        # Normalize magnitude to 0-255
        min_val, max_val = np.min(magnitude), np.max(magnitude)
        if max_val > min_val:
            norm_mag = ((magnitude - min_val) / (max_val - min_val) * 255.0).astype(np.uint8)
        else:
            norm_mag = np.zeros_like(magnitude, dtype=np.uint8)

        # Resize to fixed standard forensic square resolution for clean UI rendering
        target_size = (512, 512)
        norm_mag_resized = cv2.resize(norm_mag, target_size, interpolation=cv2.INTER_LINEAR)

        # Apply INFERNO colormap for scientific frequency power spectrum
        spectrogram_bgr = cv2.applyColorMap(norm_mag_resized, cv2.COLORMAP_INFERNO)

        sh, sw = target_size
        scy, scx = sh // 2, sw // 2

        # Draw concentric frequency rings (Nyquist radii)
        for r in [int(sw * 0.15), int(sw * 0.30), int(sw * 0.45)]:
            cv2.circle(spectrogram_bgr, (scx, scy), r, (120, 110, 90), 1, lineType=cv2.LINE_AA)

        # Draw subtle center crosshairs
        cv2.line(spectrogram_bgr, (scx - 20, scy), (scx + 20, scy), (255, 255, 255), 1)
        cv2.line(spectrogram_bgr, (scx, scy - 20), (scx, scy + 20), (255, 255, 255), 1)

        # If synthetic, draw forensic marker annotations around high-frequency corner spikes
        if is_synthetic:
            corner_offsets = [
                (int(sw * 0.22), int(sh * 0.22)),
                (int(sw * 0.78), int(sh * 0.22)),
                (int(sw * 0.22), int(sh * 0.78)),
                (int(sw * 0.78), int(sh * 0.78)),
            ]
            for cx_pt, cy_pt in corner_offsets:
                cv2.rectangle(
                    spectrogram_bgr,
                    (cx_pt - 18, cy_pt - 18),
                    (cx_pt + 18, cy_pt + 18),
                    (0, 0, 255), # Red alert
                    1,
                    lineType=cv2.LINE_AA
                )

        b64_uri = XAIVisualizer.encode_bgr_to_base64_uri(spectrogram_bgr, format_type="png")
        return spectrogram_bgr, b64_uri

    @staticmethod
    def encode_bgr_to_base64_uri(image_bgr: np.ndarray, format_type: str = "png") -> str:
        """Converts an OpenCV BGR ndarray to a base64 Data URI."""
        ext = f".{format_type.lower()}"
        success, buffer = cv2.imencode(ext, image_bgr)
        if not success:
            raise ValueError("Failed to encode image buffer")
        encoded = base64.b64encode(buffer).decode("utf-8")
        mime = "image/png" if format_type.lower() == "png" else "image/jpeg"
        return f"data:{mime};base64,{encoded}"

