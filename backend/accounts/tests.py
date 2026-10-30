from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from courses.models import Category, Course, Module, Lesson
from enrollments.models import Enrollment, LessonProgress
from quizzes.models import Quiz, Question, Choice, QuizAttempt

User = get_user_model()

class AuthenticationAndRoleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_data = {
            'email': 'test.student@example.com',
            'username': 'teststudent',
            'first_name': 'Test',
            'last_name': 'Student',
            'password': 'SecurePassword123!',
            'password2': 'SecurePassword123!',
            'role': 'student'
        }

    def test_student_registration_success(self):
        response = self.client.post('/api/auth/register/', self.student_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['role'], 'student')

    def test_registration_password_mismatch(self):
        bad_data = self.student_data.copy()
        bad_data['password2'] = 'WrongPassword!'
        response = self.client.post('/api/auth/register/', bad_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        User.objects.create_user(
            email='login.user@example.com',
            username='loginuser',
            password='LoginPassword123!',
            role='student'
        )
        response = self.client.post('/api/auth/login/', {
            'email': 'login.user@example.com',
            'password': 'LoginPassword123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


class CourseAndEnrollmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = User.objects.create_user(
            email='instructor@test.com',
            username='instructor',
            password='Password123!',
            role=User.ROLE_INSTRUCTOR
        )
        self.student = User.objects.create_user(
            email='student@test.com',
            username='student',
            password='Password123!',
            role=User.ROLE_STUDENT
        )
        self.category = Category.objects.create(name='Computer Science', slug='cs')
        self.course = Course.objects.create(
            instructor=self.instructor,
            category=self.category,
            title='Intro to Algorithms',
            slug='intro-to-algorithms',
            description='Test course description',
            status=Course.STATUS_PUBLISHED,
            level=Course.LEVEL_BEGINNER,
            price=0.0,
            is_free=True
        )
        self.module = Module.objects.create(course=self.course, title='Module 1', order=1)
        self.lesson1 = Lesson.objects.create(
            module=self.module, title='Lesson 1', duration_minutes=10, order=1
        )
        self.lesson2 = Lesson.objects.create(
            module=self.module, title='Lesson 2', duration_minutes=15, order=2
        )

    def test_course_list_public_access(self):
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_student_enrollment_and_progress(self):
        self.client.force_authenticate(user=self.student)
        
        # Enroll
        enroll_res = self.client.post('/api/enrollments/enroll/', {'course_id': self.course.id})
        self.assertEqual(enroll_res.status_code, status.HTTP_201_CREATED)

        # Mark lesson 1 complete
        progress_res = self.client.post(f'/api/enrollments/progress/{self.course.slug}/', {
            'lesson_id': self.lesson1.id,
            'is_completed': True,
            'watch_time_seconds': 600
        })
        self.assertEqual(progress_res.status_code, status.HTTP_200_OK)
        self.assertEqual(float(progress_res.data['completion_percentage']), 50.0)

        # Mark lesson 2 complete -> 100% completion & Certificate created!
        progress_res2 = self.client.post(f'/api/enrollments/progress/{self.course.slug}/', {
            'lesson_id': self.lesson2.id,
            'is_completed': True,
            'watch_time_seconds': 900
        })
        self.assertEqual(progress_res2.status_code, status.HTTP_200_OK)
        self.assertEqual(float(progress_res2.data['completion_percentage']), 100.0)

        # Verify Certificate generated
        cert_res = self.client.get('/api/certificates/my/')
        self.assertEqual(cert_res.status_code, status.HTTP_200_OK)
        results = cert_res.data.get('results', cert_res.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['course_title'], self.course.title)
