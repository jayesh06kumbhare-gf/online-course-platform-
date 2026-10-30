from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>/', views.QuizDetailView.as_view(), name='quiz_detail'),
    path('course/<slug:course_slug>/', views.CourseQuizzesView.as_view(), name='course_quizzes'),
    path('<int:quiz_id>/submit/', views.SubmitQuizView.as_view(), name='quiz_submit'),
    path('attempts/', views.QuizAttemptListView.as_view(), name='quiz_attempts'),
    path('instructor/', views.InstructorQuizListView.as_view(), name='instructor_quizzes'),
    path('instructor/<int:quiz_id>/questions/', views.InstructorQuestionCreateView.as_view(), name='quiz_question_create'),
]
