from django.db import models
from django.conf import settings
from enrollments.models import Enrollment
import uuid


class Certificate(models.Model):
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name='certificate')
    certificate_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    issued_at = models.DateTimeField(auto_now_add=True)
    is_valid = models.BooleanField(default=True)

    class Meta:
        ordering = ['-issued_at']

    def __str__(self):
        return f"Certificate for {self.enrollment.student.email} - {self.enrollment.course.title}"

    @property
    def student(self):
        return self.enrollment.student

    @property
    def course(self):
        return self.enrollment.course
