from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile, InstructorProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'full_name', 'role', 'is_verified', 'date_joined']
    list_filter = ['role', 'is_verified', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-date_joined']
    fieldsets = UserAdmin.fieldsets + (
        ('LearnSphere', {'fields': ('role', 'avatar', 'bio', 'website', 'linkedin', 'twitter', 'is_verified')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('LearnSphere', {'fields': ('email', 'role')}),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_learning_hours', 'streak_days']


@admin.register(InstructorProfile)
class InstructorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_courses', 'total_students', 'average_rating', 'is_approved']
    list_filter = ['is_approved']
