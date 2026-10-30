from rest_framework import serializers
from courses.serializers import CourseListSerializer, LessonSerializer
from .models import Enrollment, LessonProgress


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_id = serializers.IntegerField(source='lesson.id', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = LessonProgress
        fields = ['id', 'lesson_id', 'lesson_title', 'is_completed', 'completed_at', 'watch_time_seconds']


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('courses').models.Course.objects.filter(status='published'),
        source='course', write_only=True
    )
    progress = LessonProgressSerializer(many=True, read_only=True)
    last_accessed_lesson_id = serializers.IntegerField(source='last_accessed_lesson.id', read_only=True, allow_null=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'course_id', 'status', 'enrolled_at', 'completed_at',
            'completion_percentage', 'last_accessed_lesson_id', 'last_accessed_at',
            'amount_paid', 'progress',
        ]
        read_only_fields = ['status', 'enrolled_at', 'completed_at', 'completion_percentage']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class EnrollmentListSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    last_accessed_lesson_id = serializers.IntegerField(source='last_accessed_lesson.id', read_only=True, allow_null=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'status', 'enrolled_at', 'completed_at',
            'completion_percentage', 'last_accessed_lesson_id', 'last_accessed_at',
        ]


class MarkLessonCompleteSerializer(serializers.Serializer):
    lesson_id = serializers.IntegerField()
    is_completed = serializers.BooleanField(default=True)
    watch_time_seconds = serializers.IntegerField(default=0)
