from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import hashlib
import math

app = FastAPI(title="TruthLens AI Backend")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "TruthLens AI Backend Running"
    }


# --------------------------------------------------
# IMAGE ENTROPY
# --------------------------------------------------

def calculate_entropy(image):

    gray = image.convert("L")

    histogram = gray.histogram()

    total = sum(histogram)

    if total == 0:
        return 0

    entropy = 0

    for count in histogram:

        if count > 0:

            probability = count / total

            entropy -= probability * math.log2(
                probability
            )

    return round(entropy, 3)


# --------------------------------------------------
# IMAGE VERIFICATION
# --------------------------------------------------

@app.post("/verify-image")
async def verify_image(
    file: UploadFile = File(...)
):

    try:

        # Read uploaded file
        contents = await file.read()

        # Open image
        image = Image.open(
            io.BytesIO(contents)
        )

        # Force image processing
        image.load()

        width, height = image.size

        image_format = image.format or "Unknown"

        color_mode = image.mode

        # --------------------------------------------------
        # FILE HASH
        # --------------------------------------------------

        file_hash = hashlib.sha256(
            contents
        ).hexdigest()


        # --------------------------------------------------
        # METADATA
        # --------------------------------------------------

        try:

            exif = image.getexif()

            metadata_count = len(exif)

        except Exception:

            metadata_count = 0


        # --------------------------------------------------
        # ENTROPY
        # --------------------------------------------------

        entropy = calculate_entropy(image)


        # --------------------------------------------------
        # ASPECT RATIO
        # --------------------------------------------------

        aspect_ratio = round(
            width / height,
            3
        ) if height else 0


        # --------------------------------------------------
        # FORENSIC FINDINGS
        # --------------------------------------------------

        findings = []

        risk_points = 0


        # Metadata analysis

        if metadata_count == 0:

            findings.append({
                "name": "Metadata",
                "status": "No EXIF metadata found",
                "severity": "warning"
            })

            risk_points += 10

        else:

            findings.append({
                "name": "Metadata",
                "status": f"{metadata_count} EXIF fields found",
                "severity": "good"
            })


        # Format

        findings.append({
            "name": "Image Format",
            "status": image_format,
            "severity": "good"
        })


        # Resolution

        findings.append({
            "name": "Resolution",
            "status": f"{width} × {height}",
            "severity": "good"
        })


        # Entropy analysis

        if entropy < 4.5:

            findings.append({
                "name": "Pixel Distribution",
                "status": "Unusually low texture complexity",
                "severity": "warning"
            })

            risk_points += 15

        elif entropy > 7.8:

            findings.append({
                "name": "Pixel Distribution",
                "status": "High texture complexity",
                "severity": "warning"
            })

            risk_points += 5

        else:

            findings.append({
                "name": "Pixel Distribution",
                "status": "Within normal range",
                "severity": "good"
            })


        # Aspect ratio

        if (
            aspect_ratio > 3.5
            or aspect_ratio < 0.28
        ):

            findings.append({
                "name": "Geometry",
                "status": "Unusual aspect ratio",
                "severity": "warning"
            })

            risk_points += 5

        else:

            findings.append({
                "name": "Geometry",
                "status": "Normal aspect ratio",
                "severity": "good"
            })


        # --------------------------------------------------
        # LIMIT RISK
        # --------------------------------------------------

        risk_points = min(
            risk_points,
            40
        )


        # --------------------------------------------------
        # AUTHENTICITY SCORE
        # --------------------------------------------------

        authenticity_score = (
            100 - risk_points
        )


        # --------------------------------------------------
        # STATUS
        # --------------------------------------------------

        if authenticity_score >= 80:

            status = "Low Manipulation Risk"

            risk_level = "LOW"

        elif authenticity_score >= 60:

            status = "Medium Manipulation Risk"

            risk_level = "MEDIUM"

        else:

            status = "High Manipulation Risk"

            risk_level = "HIGH"


        # --------------------------------------------------
        # RESPONSE
        # --------------------------------------------------

        return {

            "filename": file.filename,

            "authenticity_score":
                authenticity_score,

            "status":
                status,

            "risk_level":
                risk_level,

            "width":
                width,

            "height":
                height,

            "format":
                image_format,

            "color_mode":
                color_mode,

            "entropy":
                entropy,

            "metadata_count":
                metadata_count,

            "aspect_ratio":
                aspect_ratio,

            "file_hash":
                file_hash[:16],

            "findings":
                findings,

            "note":
                "This is a forensic risk assessment, not a guaranteed AI-generated-image detector."

        }


    except Exception as e:

        return {
            "error": str(e)
        }



    # --------------------------------------------------
# AUDIO VERIFICATION
# --------------------------------------------------

@app.post("/verify-audio")
async def verify_audio(file: UploadFile = File(...)):

    try:

        contents = await file.read()

        if not contents:
            return {
                "error": "Empty audio file"
            }

        filename = file.filename or "audio"

        content_type = file.content_type or "unknown"

        file_size = len(contents)

        # --------------------------------------------------
        # FILE HASH
        # --------------------------------------------------

        file_hash = hashlib.sha256(
            contents
        ).hexdigest()


        # --------------------------------------------------
        # BASIC AUDIO FORENSICS
        # --------------------------------------------------

        findings = []

        risk_points = 0


        # File size check

        if file_size < 10000:

            findings.append({
                "name": "File Size",
                "status": "Very small audio file",
                "severity": "warning"
            })

            risk_points += 10

        else:

            findings.append({
                "name": "File Size",
                "status": "Normal file size",
                "severity": "good"
            })


        # MIME type

        if content_type.startswith("audio/"):

            findings.append({
                "name": "Media Type",
                "status": content_type,
                "severity": "good"
            })

        else:

            findings.append({
                "name": "Media Type",
                "status": "Unexpected media type",
                "severity": "warning"
            })

            risk_points += 10


        # Extension

        extension = filename.lower().split(".")[-1]

        supported_formats = [
            "mp3",
            "wav",
            "m4a",
            "aac",
            "ogg",
            "flac",
            "webm"
        ]

        if extension in supported_formats:

            findings.append({
                "name": "Audio Format",
                "status": extension.upper(),
                "severity": "good"
            })

        else:

            findings.append({
                "name": "Audio Format",
                "status": extension.upper(),
                "severity": "warning"
            })

            risk_points += 5


        # --------------------------------------------------
        # SIMPLE BYTE ENTROPY
        # --------------------------------------------------

        frequency = [0] * 256

        for byte in contents:

            frequency[byte] += 1


        total = len(contents)

        entropy = 0

        for count in frequency:

            if count:

                probability = count / total

                entropy -= (
                    probability *
                    math.log2(probability)
                )


        entropy = round(entropy, 3)


        if entropy < 4:

            findings.append({
                "name": "Signal Complexity",
                "status": "Low byte-level complexity",
                "severity": "warning"
            })

            risk_points += 10

        else:

            findings.append({
                "name": "Signal Complexity",
                "status": "Normal byte-level complexity",
                "severity": "good"
            })


        # --------------------------------------------------
        # SCORE
        # --------------------------------------------------

        risk_points = min(
            risk_points,
            40
        )

        authenticity_score = (
            100 - risk_points
        )


        if authenticity_score >= 80:

            status = "Low Manipulation Risk"
            risk_level = "LOW"

        elif authenticity_score >= 60:

            status = "Medium Manipulation Risk"
            risk_level = "MEDIUM"

        else:

            status = "High Manipulation Risk"
            risk_level = "HIGH"


        return {

            "filename": filename,

            "authenticity_score":
                authenticity_score,

            "status":
                status,

            "risk_level":
                risk_level,

            "file_size":
                file_size,

            "content_type":
                content_type,

            "format":
                extension.upper(),

            "entropy":
                entropy,

            "file_hash":
                file_hash[:16],

            "findings":
                findings,

            "note":
                "This is a forensic risk assessment and is not a guaranteed synthetic-voice detector."

        }


    except Exception as e:

        return {
            "error": str(e)
        }