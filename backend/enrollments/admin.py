from django.contrib import admin
from .models import Enrollment, LessonProgress

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'status', 'completion_percentage', 'enrolled_at', 'completed_at']
    list_filter = ['status']
    search_fields = ['student__email', 'course__title']

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ['enrollment', 'lesson', 'is_completed', 'completed_at', 'watch_time_seconds']
    list_filter = ['is_completed']
