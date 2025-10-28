from PIL import Image
import exifread
from utils.logger import get_logger

logger = get_logger("exif_utils")

def extract_gps_from_file(filepath):
    """
    Returns {'lat': float, 'lon': float} or None.
    """
    try:
        with open(filepath, "rb") as f:
            tags = exifread.process_file(f, details=False, stop_tag="GPS GPSLongitude")
        if 'GPS GPSLatitude' not in tags or 'GPS GPSLongitude' not in tags:
            return None

        def _to_deg(values):
            d = values.values[0].num / values.values[0].den
            m = values.values[1].num / values.values[1].den
            s = values.values[2].num / values.values[2].den
            return d + (m / 60.0) + (s / 3600.0)

        lat = _to_deg(tags['GPS GPSLatitude'])
        lat_ref = tags.get('GPS GPSLatitudeRef')
        if lat_ref and getattr(lat_ref, "values", None):
            if lat_ref.values != 'N':
                lat = -lat

        lon = _to_deg(tags['GPS GPSLongitude'])
        lon_ref = tags.get('GPS GPSLongitudeRef')
        if lon_ref and getattr(lon_ref, "values", None):
            if lon_ref.values != 'E':
                lon = -lon

        return {"lat": float(lat), "lon": float(lon)}
    except Exception as e:
        logger.exception("Failed to extract exif GPS")
        return None
