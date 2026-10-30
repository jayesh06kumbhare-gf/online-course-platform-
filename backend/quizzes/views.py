from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from accounts.permissions import IsInstructorOrAdmin
from enrollments.models import Enrollment
from .models import Quiz, Question, Choice, QuizAttempt, QuizAnswer
from .serializers import (
    QuizSerializer, SubmitQuizSerializer, QuizAttemptSerializer,
    QuizCreateSerializer, QuestionCreateSerializer
)


class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(is_active=True).prefetch_related('questions__choices')


class CourseQuizzesView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(course__slug=self.kwargs['course_slug'], is_active=True)


class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(pk=quiz_id, is_active=True)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            enrollment = Enrollment.objects.get(student=request.user, course=quiz.course)
        except Enrollment.DoesNotExist:
            return Response({'error': 'Not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)

        # Check max attempts
        attempt_count = QuizAttempt.objects.filter(
            student=request.user, quiz=quiz, status='completed'
        ).count()
        if quiz.max_attempts > 0 and attempt_count >= quiz.max_attempts:
            return Response({'error': f'Maximum {quiz.max_attempts} attempts reached.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SubmitQuizSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        attempt = QuizAttempt.objects.create(student=request.user, quiz=quiz, enrollment=enrollment)

        for answer_data in serializer.validated_data['answers']:
            try:
                question = Question.objects.get(pk=answer_data['question_id'], quiz=quiz)
                choice = Choice.objects.get(pk=answer_data['choice_id'], question=question)
                QuizAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_choice=choice,
                    is_correct=choice.is_correct,
                )
            except (Question.DoesNotExist, Choice.DoesNotExist):
                continue

        attempt.calculate_score()
        attempt.status = 'completed'
        attempt.completed_at = timezone.now()
        attempt.save()

        return Response(QuizAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class QuizAttemptListView(generics.ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(
            student=self.request.user, status='completed'
        ).select_related('quiz')


class InstructorQuizListView(generics.ListCreateAPIView):
    serializer_class = QuizCreateSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Quiz.objects.filter(course__instructor=self.request.user)


class InstructorQuestionCreateView(generics.CreateAPIView):
    serializer_class = QuestionCreateSerializer
    permission_classes = [IsInstructorOrAdmin]

    def perform_create(self, serializer):
        quiz = Quiz.objects.get(pk=self.kwargs['quiz_id'])
        serializer.save(quiz=quiz)
