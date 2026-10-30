from rest_framework import serializers
from .models import Quiz, Question, Choice, QuizAttempt, QuizAnswer


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'choice_text', 'order']


class ChoiceWithAnswerSerializer(ChoiceSerializer):
    class Meta(ChoiceSerializer.Meta):
        fields = ChoiceSerializer.Meta.fields + ['is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'order', 'points', 'choices']


class QuestionWithAnswerSerializer(QuestionSerializer):
    choices = ChoiceWithAnswerSerializer(many=True, read_only=True)

    class Meta(QuestionSerializer.Meta):
        fields = QuestionSerializer.Meta.fields + ['explanation']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'time_limit_minutes', 'passing_score', 'max_attempts', 'question_count', 'questions']

    def get_question_count(self, obj):
        return obj.questions.count()


class QuizAnswerInputSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()


class SubmitQuizSerializer(serializers.Serializer):
    answers = QuizAnswerInputSerializer(many=True)


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    answers = serializers.SerializerMethodField()

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz_title', 'score', 'total_points', 'earned_points', 'passed', 'started_at', 'completed_at', 'answers']

    def get_answers(self, obj):
        answers = obj.answers.select_related('question', 'selected_choice')
        return [{
            'question_id': a.question.id,
            'question_text': a.question.question_text,
            'selected_choice_id': a.selected_choice.id if a.selected_choice else None,
            'is_correct': a.is_correct,
            'explanation': a.question.explanation,
        } for a in answers]


class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'course', 'lesson', 'title', 'description', 'time_limit_minutes', 'passing_score', 'max_attempts', 'is_active']


class QuestionCreateSerializer(serializers.ModelSerializer):
    choices = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'explanation', 'order', 'points', 'choices']

    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])
        question = Question.objects.create(**validated_data)
        for i, c in enumerate(choices_data):
            Choice.objects.create(
                question=question,
                choice_text=c['text'],
                is_correct=c.get('is_correct', False),
                order=i
            )
        return question
