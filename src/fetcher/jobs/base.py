from __future__ import annotations
from abc import ABC, abstractmethod

from .models import Job, JobSearchFilter


class JobProvider(ABC):
    """Base interface for all job providers."""

    @abstractmethod
    def search_jobs(self, filters: JobSearchFilter) -> list[Job]:
        """
        Search jobs using the provider and return normalized Job models.
        """
        raise NotImplementedError