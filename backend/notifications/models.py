from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_ENROLLMENT = 'enrollment'
    TYPE_COURSE_APPROVED = 'course_approved'
    TYPE_QUIZ_RESULT = 'quiz_result'
    TYPE_CERTIFICATE = 'certificate'
    TYPE_GENERAL = 'general'
    TYPE_CHOICES = [
        (TYPE_ENROLLMENT, 'Enrollment'),
        (TYPE_COURSE_APPROVED, 'Course Approved'),
        (TYPE_QUIZ_RESULT, 'Quiz Result'),
        (TYPE_CERTIFICATE, 'Certificate'),
        (TYPE_GENERAL, 'General'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default=TYPE_GENERAL)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email}: {self.title}"
