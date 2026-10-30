export type Role = 'student' | 'instructor' | 'admin';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  is_verified: boolean;
  created_at: string;
}

export interface StudentProfile {
  learning_goals: string;
  total_learning_hours: number;
  streak_days: number;
  last_active?: string;
}

export interface InstructorProfile {
  expertise: string;
  years_of_experience: number;
  total_students: number;
  total_courses: number;
  average_rating: number;
  is_approved: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  course_count: number;
}

export interface LessonResource {
  name: string;
  url: string;
  type: string;
}

export interface Lesson {
  id: number;
  title: string;
  lesson_type: 'video' | 'text' | 'quiz';
  content?: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
  is_free_preview: boolean;
  resources: LessonResource[];
  created_at?: string;
}

export interface Module {
  id: number;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  lesson_count?: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description?: string;
  thumbnail_display?: string;
  thumbnail_url?: string;
  preview_video_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  language: string;
  price: number | string;
  is_free: boolean;
  duration_hours: number;
  total_lessons: number;
  total_students: number;
  average_rating: number;
  total_reviews: number;
  is_featured: boolean;
  instructor_name: string;
  instructor_avatar?: string;
  category_name?: string;
  is_bookmarked?: boolean;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  learning_outcomes?: string[];
  requirements?: string[];
  tags?: string[];
  modules?: Module[];
  instructor?: User;
  created_at: string;
  published_at?: string;
}

export interface LessonProgress {
  id: number;
  lesson_id: number;
  lesson_title: string;
  is_completed: boolean;
  completed_at?: string;
  watch_time_seconds: number;
}

export interface Enrollment {
  id: number;
  course: Course;
  status: 'active' | 'completed' | 'dropped';
  enrolled_at: string;
  completed_at?: string;
  completion_percentage: number;
  last_accessed_lesson_id?: number;
  last_accessed_at?: string;
  amount_paid?: number;
  progress?: LessonProgress[];
}

export interface Choice {
  id: number;
  choice_text: string;
  order: number;
  is_correct?: boolean;
}

export interface Question {
  id: number;
  question_text: string;
  question_type: 'mcq' | 'true_false';
  explanation?: string;
  order: number;
  points: number;
  choices: Choice[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  question_count: number;
  questions: Question[];
}

export interface QuizAttemptAnswer {
  question_id: number;
  question_text: string;
  selected_choice_id: number | null;
  is_correct: boolean;
  explanation: string;
}

export interface QuizAttempt {
  id: number;
  quiz_title: string;
  score: number;
  total_points: number;
  earned_points: number;
  passed: boolean;
  started_at: string;
  completed_at: string;
  answers: QuizAttemptAnswer[];
}

export interface Certificate {
  id: number;
  certificate_id: string;
  student_name: string;
  course_title: string;
  instructor_name: string;
  completion_date?: string;
  issued_at: string;
  is_valid: boolean;
}

export interface Review {
  id: number;
  student_name: string;
  student_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Notification {
  id: number;
  notification_type: 'enrollment' | 'course_approved' | 'quiz_result' | 'certificate' | 'general';
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface StudentDashboardStats {
  total_enrolled: number;
  in_progress: number;
  completed: number;
  total_learning_hours: number;
  certificates_count: number;
  recent_enrollments: Enrollment[];
}

export interface AdminAnalytics {
  total_students: number;
  total_instructors: number;
  total_courses: number;
  published_courses: number;
  pending_courses: number;
  total_enrollments: number;
  completed_enrollments: number;
  total_revenue: number;
  categories: { name: string; course_num: number }[];
  pending_courses_list: Course[];
  recent_enrollments: {
    id: number;
    student__email: string;
    student__first_name: string;
    student__last_name: string;
    course__title: string;
    amount_paid: number;
    enrolled_at: string;
    completion_percentage: number;
  }[];
}

export interface InstructorAnalytics {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  pending_courses: number;
  total_students: number;
  total_enrollments: number;
  total_revenue: number;
  average_rating: number;
  course_performance: {
    id: number;
    title: string;
    total_students: number;
    average_rating: number;
    price: number;
    status: string;
  }[];
}
