from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category_detail'),
    path('', views.CourseListView.as_view(), name='course_list'),
    path('featured/', views.FeaturedCoursesView.as_view(), name='featured_courses'),
    path('admin/', views.AdminCourseListView.as_view(), name='admin_course_list'),
    path('analytics/admin/', views.AdminAnalyticsView.as_view(), name='admin_analytics'),
    path('analytics/instructor/', views.InstructorAnalyticsView.as_view(), name='instructor_analytics'),
    path('instructor/', views.InstructorCourseListView.as_view(), name='instructor_course_list'),
    path('instructor/<int:pk>/', views.InstructorCourseDetailView.as_view(), name='instructor_course_detail'),
    path('instructor/<int:pk>/publish/', views.CoursePublishView.as_view(), name='course_publish'),
    path('<slug:slug>/', views.CourseDetailView.as_view(), name='course_detail'),
    # Modules
    path('<int:course_pk>/modules/', views.ModuleListView.as_view(), name='module_list'),
    path('<int:course_pk>/modules/<int:pk>/', views.ModuleDetailView.as_view(), name='module_detail'),
    # Lessons
    path('<int:course_pk>/modules/<int:module_pk>/lessons/', views.LessonListView.as_view(), name='lesson_list'),
    path('<int:course_pk>/modules/<int:module_pk>/lessons/<int:pk>/', views.LessonDetailView.as_view(), name='lesson_detail'),
    # Bookmarks
    path('bookmarks/', views.BookmarkListView.as_view(), name='bookmark_list'),
    path('bookmarks/<int:course_pk>/', views.BookmarkDeleteView.as_view(), name='bookmark_delete'),
]
