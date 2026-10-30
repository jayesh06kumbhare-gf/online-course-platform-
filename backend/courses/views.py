from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q
from accounts.permissions import IsAdminUser, IsInstructorOrAdmin
from .models import Category, Course, Module, Lesson, Bookmark
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    CourseCreateUpdateSerializer, ModuleSerializer, ModuleCreateSerializer,
    LessonSerializer, LessonCreateSerializer, BookmarkSerializer
)
import django_filters


class CourseFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug')
    level = django_filters.CharFilter(field_name='level')
    is_free = django_filters.BooleanFilter(field_name='is_free')

    class Meta:
        model = Course
        fields = ['level', 'is_free', 'category', 'min_price', 'max_price']


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [permissions.AllowAny()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'


class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CourseFilter
    search_fields = ['title', 'subtitle', 'description', 'tags']
    ordering_fields = ['created_at', 'price', 'average_rating', 'total_students']
    ordering = ['-created_at']

    def get_queryset(self):
        return Course.objects.filter(status=Course.STATUS_PUBLISHED).select_related('instructor', 'category')


class FeaturedCoursesView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Course.objects.filter(status=Course.STATUS_PUBLISHED, is_featured=True).select_related('instructor', 'category')[:6]


class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        user = self.request.user
        qs = Course.objects.select_related('instructor', 'category').prefetch_related('modules__lessons')
        if user.is_authenticated and (user.role in ['admin', 'instructor'] or user.is_staff):
            return qs
        return qs.filter(status=Course.STATUS_PUBLISHED)


class InstructorCourseListView(generics.ListCreateAPIView):
    permission_classes = [IsInstructorOrAdmin]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseCreateUpdateSerializer
        return CourseListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_staff:
            return Course.objects.all().select_related('instructor', 'category')
        return Course.objects.filter(instructor=user).select_related('instructor', 'category')


class InstructorCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsInstructorOrAdmin]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CourseCreateUpdateSerializer
        return CourseDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_staff:
            return Course.objects.all()
        return Course.objects.filter(instructor=user)


class CoursePublishView(APIView):
    permission_classes = [IsInstructorOrAdmin]

    def post(self, request, pk):
        try:
            if request.user.role == 'admin' or request.user.is_staff:
                course = Course.objects.get(pk=pk)
            else:
                course = Course.objects.get(pk=pk, instructor=request.user)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'submit':
            course.status = Course.STATUS_PENDING
        elif action == 'approve' and (request.user.role == 'admin' or request.user.is_staff):
            course.status = Course.STATUS_PUBLISHED
            course.published_at = timezone.now()
        elif action == 'reject' and (request.user.role == 'admin' or request.user.is_staff):
            course.status = Course.STATUS_REJECTED
        elif action == 'unpublish' and (request.user.role == 'admin' or request.user.is_staff):
            course.status = Course.STATUS_DRAFT
        else:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)
        course.save()
        return Response({'status': course.status})


class ModuleListView(generics.ListCreateAPIView):
    permission_classes = [IsInstructorOrAdmin]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ModuleCreateSerializer
        return ModuleSerializer

    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        course = Course.objects.get(pk=self.kwargs['course_pk'])
        serializer.save(course=course)


class ModuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ModuleCreateSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_pk'])


class LessonListView(generics.ListCreateAPIView):
    serializer_class = LessonCreateSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Lesson.objects.filter(module_id=self.kwargs['module_pk'])

    def perform_create(self, serializer):
        module = Module.objects.get(pk=self.kwargs['module_pk'])
        lesson = serializer.save(module=module)
        # Update course lesson count and duration
        course = module.course
        course.total_lessons = Lesson.objects.filter(module__course=course).count()
        course.duration_hours = sum(
            l.duration_minutes for l in Lesson.objects.filter(module__course=course)
        ) / 60
        course.save()


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LessonCreateSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Lesson.objects.filter(module_id=self.kwargs['module_pk'])


class BookmarkListView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).select_related('course')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookmarkDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, course_pk):
        Bookmark.objects.filter(user=request.user, course_id=course_pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'instructor__email']
    filterset_fields = ['status', 'level']

    def get_queryset(self):
        return Course.objects.all().select_related('instructor', 'category')


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.contrib.auth import get_user_model
        from enrollments.models import Enrollment
        from django.db.models import Sum, Count, Avg
        User = get_user_model()

        total_students = User.objects.filter(role=User.ROLE_STUDENT).count()
        total_instructors = User.objects.filter(role=User.ROLE_INSTRUCTOR).count()
        total_courses = Course.objects.count()
        published_courses = Course.objects.filter(status=Course.STATUS_PUBLISHED).count()
        pending_courses = Course.objects.filter(status=Course.STATUS_PENDING).count()
        total_enrollments = Enrollment.objects.count()
        completed_enrollments = Enrollment.objects.filter(status='completed').count()
        total_revenue = Enrollment.objects.aggregate(total=Sum('amount_paid'))['total'] or 0

        # Category distribution
        categories_data = Category.objects.annotate(
            course_num=Count('courses')
        ).values('name', 'course_num')

        # Recent 5 pending courses
        pending_list = CourseListSerializer(
            Course.objects.filter(status=Course.STATUS_PENDING)[:5],
            many=True,
            context={'request': request}
        ).data

        # Recent 5 enrollments
        recent_enrollments = list(Enrollment.objects.select_related('student', 'course').order_by('-enrolled_at')[:5].values(
            'id', 'student__email', 'student__first_name', 'student__last_name',
            'course__title', 'amount_paid', 'enrolled_at', 'completion_percentage'
        ))

        return Response({
            'total_students': total_students,
            'total_instructors': total_instructors,
            'total_courses': total_courses,
            'published_courses': published_courses,
            'pending_courses': pending_courses,
            'total_enrollments': total_enrollments,
            'completed_enrollments': completed_enrollments,
            'total_revenue': float(total_revenue),
            'categories': list(categories_data),
            'pending_courses_list': pending_list,
            'recent_enrollments': recent_enrollments,
        })


class InstructorAnalyticsView(APIView):
    permission_classes = [IsInstructorOrAdmin]

    def get(self, request):
        from enrollments.models import Enrollment
        from django.db.models import Sum, Count, Avg

        user = request.user
        courses = Course.objects.filter(instructor=user)
        total_courses = courses.count()
        published_courses = courses.filter(status=Course.STATUS_PUBLISHED).count()
        draft_courses = courses.filter(status=Course.STATUS_DRAFT).count()
        pending_courses = courses.filter(status=Course.STATUS_PENDING).count()

        course_ids = courses.values_list('id', flat=True)
        enrollments = Enrollment.objects.filter(course_id__in=course_ids)
        total_students = enrollments.values('student').distinct().count()
        total_enrollments = enrollments.count()
        total_revenue = enrollments.aggregate(total=Sum('amount_paid'))['total'] or 0
        avg_rating = courses.aggregate(avg=Avg('average_rating'))['avg'] or 0.0

        course_performance = courses.values('id', 'title', 'total_students', 'average_rating', 'price', 'status')

        return Response({
            'total_courses': total_courses,
            'published_courses': published_courses,
            'draft_courses': draft_courses,
            'pending_courses': pending_courses,
            'total_students': total_students,
            'total_enrollments': total_enrollments,
            'total_revenue': float(total_revenue),
            'average_rating': round(float(avg_rating), 2),
            'course_performance': list(course_performance),
        })

