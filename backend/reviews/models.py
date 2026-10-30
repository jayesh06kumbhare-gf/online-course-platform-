from django.db import models
from django.conf import settings
from courses.models import Course
from enrollments.models import Enrollment


class Review(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name='review', null=True, blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.email} - {self.course.title} ({self.rating}/5)"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update course average rating
        reviews = Review.objects.filter(course=self.course)
        if reviews.exists():
            avg = sum(r.rating for r in reviews) / reviews.count()
            self.course.average_rating = round(avg, 2)
            self.course.total_reviews = reviews.count()
            self.course.save(update_fields=['average_rating', 'total_reviews'])
