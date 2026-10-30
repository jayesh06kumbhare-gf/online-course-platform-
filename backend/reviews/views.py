from rest_framework import generics, permissions
from courses.models import Course
from .models import Review
from .serializers import ReviewSerializer


class CourseReviewListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Review.objects.filter(
            course__slug=self.kwargs['course_slug']
        ).select_related('student')

    def perform_create(self, serializer):
        course = Course.objects.get(slug=self.kwargs['course_slug'])
        serializer.save(course=course)


class ReviewUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(student=self.request.user)
