from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'student_name', 'student_avatar', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'student_name', 'student_avatar', 'created_at']

    def get_student_avatar(self, obj):
        request = self.context.get('request')
        if obj.student.avatar and request:
            return request.build_absolute_uri(obj.student.avatar.url)
        return None

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)
