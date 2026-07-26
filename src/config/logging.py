from pathlib import Path

from loguru import logger


LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

logger.remove()

logger.add(
    LOG_DIR / "app.log",
    rotation="10 MB",
    retention=10,
    enqueue=True,
    level="INFO",
)

logger.add(
    lambda msg: print(msg, end=""),
    level="INFO",
)