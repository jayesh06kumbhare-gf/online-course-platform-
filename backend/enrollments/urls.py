from django.urls import path
from . import views

urlpatterns = [
    path('enroll/', views.EnrollView.as_view(), name='enroll'),
    path('my/', views.EnrollmentListView.as_view(), name='my_enrollments'),
    path('my/<slug:course_slug>/', views.EnrollmentDetailView.as_view(), name='enrollment_detail'),
    path('check/<slug:course_slug>/', views.CheckEnrollmentView.as_view(), name='check_enrollment'),
    path('progress/<slug:course_slug>/', views.MarkLessonCompleteView.as_view(), name='mark_lesson_complete'),
    path('dashboard/', views.StudentDashboardView.as_view(), name='student_dashboard'),
    path('instructor/students/', views.InstructorStudentsView.as_view(), name='instructor_students'),
    path('admin/', views.AdminEnrollmentListView.as_view(), name='admin_enrollments'),
]
