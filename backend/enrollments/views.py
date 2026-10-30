from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from accounts.permissions import IsAdminUser
from courses.models import Course, Lesson
from .models import Enrollment, LessonProgress
from .serializers import (
    EnrollmentSerializer, EnrollmentListSerializer, MarkLessonCompleteSerializer
)


class EnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        course_id = request.data.get('course_id')
        try:
            course = Course.objects.get(pk=course_id, status='published')
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        if Enrollment.objects.filter(student=request.user, course=course).exists():
            return Response({'error': 'Already enrolled.'}, status=status.HTTP_400_BAD_REQUEST)

        enrollment = Enrollment.objects.create(
            student=request.user,
            course=course,
            amount_paid=0 if course.is_free else course.price
        )
        course.total_students = course.enrollments.count()
        course.save()
        return Response(EnrollmentListSerializer(enrollment).data, status=status.HTTP_201_CREATED)


class EnrollmentListView(generics.ListAPIView):
    serializer_class = EnrollmentListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            student=self.request.user
        ).select_related('course', 'course__instructor', 'course__category', 'last_accessed_lesson')


class EnrollmentDetailView(generics.RetrieveAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        course_slug = self.kwargs.get('course_slug')
        return generics.get_object_or_404(
            Enrollment.objects.filter(student=self.request.user).prefetch_related('progress__lesson'),
            course__slug=course_slug
        )


class CheckEnrollmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_slug):
        enrolled = Enrollment.objects.filter(
            student=request.user, course__slug=course_slug
        ).exists()
        return Response({'enrolled': enrolled})


class MarkLessonCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_slug):
        serializer = MarkLessonCompleteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            enrollment = Enrollment.objects.get(student=request.user, course__slug=course_slug)
        except Enrollment.DoesNotExist:
            return Response({'error': 'Not enrolled.'}, status=status.HTTP_404_NOT_FOUND)

        lesson_id = serializer.validated_data['lesson_id']
        try:
            lesson = Lesson.objects.get(pk=lesson_id, module__course=enrollment.course)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found.'}, status=status.HTTP_404_NOT_FOUND)

        progress, created = LessonProgress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
        progress.is_completed = serializer.validated_data['is_completed']
        progress.watch_time_seconds = max(progress.watch_time_seconds, serializer.validated_data['watch_time_seconds'])
        if progress.is_completed and not progress.completed_at:
            progress.completed_at = timezone.now()
        progress.save()

        enrollment.last_accessed_lesson = lesson
        enrollment.last_accessed_at = timezone.now()
        enrollment.save()
        enrollment.update_completion()

        if enrollment.completion_percentage >= 100:
            from certificates.models import Certificate
            Certificate.objects.get_or_create(enrollment=enrollment)

        return Response({
            'completion_percentage': enrollment.completion_percentage,
            'is_completed': progress.is_completed,
        })


class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        enrollments = Enrollment.objects.filter(student=user).select_related('course')
        total_enrolled = enrollments.count()
        in_progress = enrollments.filter(status='active', completion_percentage__gt=0).count()
        completed = enrollments.filter(status='completed').count()
        total_learning_hours = sum(
            float(e.completion_percentage) / 100 * float(e.course.duration_hours)
            for e in enrollments
        )
        recent_enrollments = EnrollmentListSerializer(
            enrollments.order_by('-last_accessed_at')[:5], many=True
        ).data

        from certificates.models import Certificate
        certificates_count = Certificate.objects.filter(enrollment__student=user).count()

        return Response({
            'total_enrolled': total_enrolled,
            'in_progress': in_progress,
            'completed': completed,
            'total_learning_hours': round(total_learning_hours, 1),
            'certificates_count': certificates_count,
            'recent_enrollments': recent_enrollments,
        })


class InstructorStudentsView(generics.ListAPIView):
    serializer_class = EnrollmentListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            course__instructor=self.request.user
        ).select_related('student', 'course')


class AdminEnrollmentListView(generics.ListAPIView):
    serializer_class = EnrollmentListSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Enrollment.objects.all().select_related('student', 'course')
