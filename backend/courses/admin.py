from django.contrib import admin
from .models import Category, Course, Module, Lesson, Bookmark


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'course_count']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'category', 'level', 'status', 'is_featured', 'total_students', 'average_rating']
    list_filter = ['status', 'level', 'is_featured', 'category']
    search_fields = ['title', 'instructor__email']
    prepopulated_fields = {'slug': ('title',)}
    actions = ['approve_courses', 'reject_courses', 'feature_courses']

    def approve_courses(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='published', published_at=timezone.now())
    approve_courses.short_description = "Approve selected courses"

    def reject_courses(self, request, queryset):
        queryset.update(status='rejected')
    reject_courses.short_description = "Reject selected courses"

    def feature_courses(self, request, queryset):
        queryset.update(is_featured=True)
    feature_courses.short_description = "Feature selected courses"


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'lesson_type', 'duration_minutes', 'is_free_preview']
