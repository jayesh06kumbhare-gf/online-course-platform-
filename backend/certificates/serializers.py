from rest_framework import serializers
from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='enrollment.student.full_name', read_only=True)
    course_title = serializers.CharField(source='enrollment.course.title', read_only=True)
    instructor_name = serializers.CharField(source='enrollment.course.instructor.full_name', read_only=True)
    completion_date = serializers.DateTimeField(source='enrollment.completed_at', read_only=True)

    class Meta:
        model = Certificate
        fields = ['id', 'certificate_id', 'student_name', 'course_title', 'instructor_name', 'completion_date', 'issued_at', 'is_valid']
