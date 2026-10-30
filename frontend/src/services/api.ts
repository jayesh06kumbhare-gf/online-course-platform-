import {
  User, Course, Category, Enrollment, Quiz, QuizAttempt,
  Certificate, Review, Notification, StudentDashboardStats,
  AdminAnalytics, InstructorAnalytics, Module, Lesson
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${String(import.meta.env.VITE_API_URL).replace(/\/+$/, '')}/api`
  : '/api';

class ApiService {
  private getHeaders(contentType = 'application/json'): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = this.getHeaders();

    let response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    // Handle token expiration & automatic refresh
    if (response.status === 401 && localStorage.getItem('refresh_token')) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...this.getHeaders(),
            ...(options.headers || {}),
          },
        });
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText };
      }
      throw errorData;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
      const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        return true;
      }
    } catch {
      // Refresh failed
    }
    this.clearAuth();
    return false;
  }

  public clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // --- Auth ---
  async login(credentials: { email: string; password: string }) {
    const data = await this.request<{ access: string; refresh: string; user: User }>(
      '/auth/login/',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async register(payload: Record<string, any>) {
    const data = await this.request<{ access: string; refresh: string; user: User }>(
      '/auth/register/',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async logout() {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        });
      }
    } finally {
      this.clearAuth();
    }
  }

  async getMe(): Promise<User> {
    const user = await this.request<User>('/auth/me/');
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const user = await this.request<User>('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async changePassword(passwords: { old_password: string; new_password: string }) {
    return this.request<{ message: string }>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  // --- Public & Student Courses ---
  async getCategories(): Promise<{ results?: Category[] } | Category[]> {
    return this.request<any>('/courses/categories/');
  }

  async getCourses(params: Record<string, string | number | boolean> = {}): Promise<{ count: number; results: Course[] }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ count: number; results: Course[] }>(`/courses/${qs}`);
  }

  async getFeaturedCourses(): Promise<{ results?: Course[] } | Course[]> {
    return this.request<any>('/courses/featured/');
  }

  async getCourseDetail(slug: string): Promise<Course> {
    return this.request<Course>(`/courses/${slug}/`);
  }

  async toggleBookmark(courseId: number, isCurrentlyBookmarked: boolean) {
    if (isCurrentlyBookmarked) {
      return this.request(`/courses/bookmarks/${courseId}/`, { method: 'DELETE' });
    } else {
      return this.request('/courses/bookmarks/', {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId }),
      });
    }
  }

  async getBookmarks(): Promise<{ results?: { id: number; course: Course }[] }> {
    return this.request<any>('/courses/bookmarks/');
  }

  // --- Enrollments & Learning ---
  async checkEnrollment(slug: string): Promise<{ enrolled: boolean }> {
    return this.request<{ enrolled: boolean }>(`/enrollments/check/${slug}/`);
  }

  async enrollCourse(courseId: number): Promise<Enrollment> {
    return this.request<Enrollment>('/enrollments/enroll/', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
  }

  async getMyEnrollments(): Promise<{ results?: Enrollment[] }> {
    return this.request<any>('/enrollments/my/');
  }

  async getEnrollmentDetail(courseSlug: string): Promise<Enrollment> {
    return this.request<Enrollment>(`/enrollments/my/${courseSlug}/`);
  }

  async markLessonProgress(courseSlug: string, lessonId: number, isCompleted: boolean, watchTimeSeconds = 0) {
    return this.request<{ completion_percentage: number; is_completed: boolean }>(
      `/enrollments/progress/${courseSlug}/`,
      {
        method: 'POST',
        body: JSON.stringify({
          lesson_id: lessonId,
          is_completed: isCompleted,
          watch_time_seconds: watchTimeSeconds,
        }),
      }
    );
  }

  async getStudentDashboard(): Promise<StudentDashboardStats> {
    return this.request<StudentDashboardStats>('/enrollments/dashboard/');
  }

  // --- Quizzes ---
  async getCourseQuizzes(courseSlug: string): Promise<{ results?: Quiz[] }> {
    return this.request<any>(`/quizzes/course/${courseSlug}/`);
  }

  async getQuiz(quizId: number): Promise<Quiz> {
    return this.request<Quiz>(`/quizzes/${quizId}/`);
  }

  async submitQuiz(quizId: number, answers: { question_id: number; choice_id: number }[]): Promise<QuizAttempt> {
    return this.request<QuizAttempt>(`/quizzes/${quizId}/submit/`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getQuizAttempts(): Promise<{ results?: QuizAttempt[] }> {
    return this.request<any>('/quizzes/attempts/');
  }

  // --- Certificates ---
  async getMyCertificates(): Promise<{ results?: Certificate[] } | Certificate[]> {
    return this.request<any>('/certificates/my/');
  }

  async verifyCertificate(certificateId: string): Promise<Certificate> {
    return this.request<Certificate>(`/certificates/verify/${certificateId}/`);
  }

  // --- Reviews ---
  async getCourseReviews(courseSlug: string): Promise<{ results?: Review[] }> {
    return this.request<any>(`/reviews/course/${courseSlug}/`);
  }

  async createReview(courseSlug: string, review: { rating: number; comment: string }): Promise<Review> {
    return this.request<Review>(`/reviews/course/${courseSlug}/`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // --- Notifications ---
  async getNotifications(): Promise<{ results?: Notification[] }> {
    return this.request<any>('/notifications/');
  }

  async markNotificationRead(id: number) {
    return this.request(`/notifications/${id}/read/`, { method: 'POST' });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all/', { method: 'POST' });
  }

  // --- Instructor Views ---
  async getInstructorAnalytics(): Promise<InstructorAnalytics> {
    return this.request<InstructorAnalytics>('/courses/analytics/instructor/');
  }

  async getInstructorCourses(): Promise<{ results?: Course[] } | Course[]> {
    return this.request<any>('/courses/instructor/');
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    return this.request<Course>('/courses/instructor/', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    return this.request<Course>(`/courses/instructor/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(courseData),
    });
  }

  async submitCourseForReview(courseId: number) {
    return this.request(`/courses/instructor/${courseId}/publish/`, {
      method: 'POST',
      body: JSON.stringify({ action: 'submit' }),
    });
  }

  async addModule(courseId: number, moduleData: { title: string; description?: string; order: number }) {
    return this.request<Module>(`/courses/${courseId}/modules/`, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  async addLesson(courseId: number, moduleId: number, lessonData: Partial<Lesson>) {
    return this.request<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/`, {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  }

  // --- Admin Views ---
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    return this.request<AdminAnalytics>('/courses/analytics/admin/');
  }

  async getAdminCourses(status?: string): Promise<{ results?: Course[] } | Course[]> {
    const url = status ? `/courses/admin/?status=${status}` : '/courses/admin/';
    return this.request<any>(url);
  }

  async updateCourseStatus(courseId: number, action: 'approve' | 'reject' | 'unpublish') {
    return this.request(`/courses/instructor/${courseId}/publish/`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  async getAdminUsers(role?: string): Promise<{ results?: User[] } | User[]> {
    const url = role ? `/auth/users/?role=${role}` : '/auth/users/';
    return this.request<any>(url);
  }

  async createCategory(categoryData: { name: string; description: string; icon?: string; color?: string }) {
    return this.request<Category>('/courses/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }
}

export const api = new ApiService();
