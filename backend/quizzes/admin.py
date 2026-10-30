from django.contrib import admin
from .models import Quiz, Question, Choice, QuizAttempt, QuizAnswer

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson', 'passing_score', 'time_limit_minutes', 'is_active']
    list_filter = ['is_active', 'course']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'order', 'question_text', 'question_type', 'points']
    inlines = [ChoiceInline]

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['student', 'quiz', 'score', 'passed', 'status', 'started_at', 'completed_at']
    list_filter = ['passed', 'status']
