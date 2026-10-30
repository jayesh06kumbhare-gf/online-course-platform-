from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['certificate_id', 'student', 'course', 'issued_at', 'is_valid']
    search_fields = ['certificate_id', 'enrollment__student__email', 'enrollment__course__title']
