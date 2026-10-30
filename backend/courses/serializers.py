from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Category, Course, Module, Lesson, Bookmark


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color', 'course_count']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'lesson_type', 'content', 'video_url',
            'duration_minutes', 'order', 'is_free_preview', 'resources',
        ]


class LessonDetailSerializer(LessonSerializer):
    class Meta(LessonSerializer.Meta):
        fields = LessonSerializer.Meta.fields + ['created_at', 'updated_at']


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lesson_count = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'lessons', 'lesson_count']

    def get_lesson_count(self, obj):
        return obj.lessons.count()


class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    instructor_avatar = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    thumbnail_display = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'subtitle', 'thumbnail_display',
            'level', 'language', 'price', 'is_free',
            'duration_hours', 'total_lessons', 'total_students',
            'average_rating', 'total_reviews', 'is_featured',
            'instructor_name', 'instructor_avatar', 'category_name', 'is_bookmarked',
            'status', 'created_at',
        ]

    def get_instructor_name(self, obj):
        return obj.instructor.full_name

    def get_instructor_avatar(self, obj):
        request = self.context.get('request')
        if obj.instructor.avatar and request:
            return request.build_absolute_uri(obj.instructor.avatar.url)
        return None

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_thumbnail_display(self, obj):
        request = self.context.get('request')
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return obj.thumbnail_url or None

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False


class CourseDetailSerializer(CourseListSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor = UserSerializer(read_only=True)

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + [
            'description', 'preview_video_url', 'learning_outcomes',
            'requirements', 'tags', 'modules', 'instructor', 'published_at',
        ]


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'title', 'subtitle', 'description', 'category', 'thumbnail',
            'thumbnail_url', 'preview_video_url', 'level', 'language',
            'price', 'is_free', 'learning_outcomes', 'requirements', 'tags',
        ]

    def create(self, validated_data):
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)


class ModuleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order']


class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'lesson_type', 'content', 'video_url', 'duration_minutes', 'order', 'is_free_preview', 'resources']


class BookmarkSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source='course', write_only=True
    )

    class Meta:
        model = Bookmark
        fields = ['id', 'course', 'course_id', 'created_at']
