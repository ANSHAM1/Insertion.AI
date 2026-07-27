from __future__ import annotations
from abc import ABC, abstractmethod

from .models import JobPosting, JobSearchQuery



class JobProvider(ABC):
    """
    Base class for all job providers.
    """

    name: str

    @abstractmethod
    def search(self, query: JobSearchQuery) -> list[JobPosting]:
        """
        Search jobs matching the given query.
        """
        raise NotImplementedError