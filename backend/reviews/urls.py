from django.urls import path
from . import views

urlpatterns = [
    path('course/<slug:course_slug>/', views.CourseReviewListView.as_view(), name='course_reviews'),
    path('<int:pk>/', views.ReviewUpdateView.as_view(), name='review_detail'),
]
