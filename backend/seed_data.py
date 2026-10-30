"""
LearnSphere Database Seed Script
Populates the database with realistic demo accounts, categories, courses,
modules, lessons, quizzes, enrollments, progress, certificates, and reviews.
"""
import os
import sys
import django
import uuid
from datetime import timedelta

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnsphere.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from accounts.models import StudentProfile, InstructorProfile
from courses.models import Category, Course, Module, Lesson, Bookmark
from enrollments.models import Enrollment, LessonProgress
from quizzes.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer
from certificates.models import Certificate
from reviews.models import Review
from notifications.models import Notification

User = get_user_model()

def run_seed():
    print("[*] Starting LearnSphere Database Seeding...")

    # 1. Clear existing non-essential data if any (idempotent setup)
    print("[-] Cleaning previous demo data...")
    Certificate.objects.all().delete()
    QuizAnswer.objects.all().delete()
    QuizAttempt.objects.all().delete()
    Choice.objects.all().delete()
    Question.objects.all().delete()
    Quiz.objects.all().delete()
    LessonProgress.objects.all().delete()
    Enrollment.objects.all().delete()
    Bookmark.objects.all().delete()
    Review.objects.all().delete()
    Notification.objects.all().delete()
    Lesson.objects.all().delete()
    Module.objects.all().delete()
    Course.objects.all().delete()
    Category.objects.all().delete()
    User.objects.all().delete()

    # 2. Create Users
    print("👤 Creating demo users...")
    admin_user = User.objects.create_superuser(
        email='admin@learnsphere.com',
        username='admin',
        password='AdminPassword123!',
        first_name='Admin',
        last_name='Director',
        role=User.ROLE_ADMIN,
        bio='Chief Academic Officer and Platform Administrator at LearnSphere.'
    )

    instructor_sarah = User.objects.create_user(
        email='sarah.chen@learnsphere.com',
        username='sarahchen',
        password='InstructorPassword123!',
        first_name='Dr. Sarah',
        last_name='Chen',
        role=User.ROLE_INSTRUCTOR,
        bio='Former Senior AI Research Scientist at DeepMind. PhD in Computer Science from Stanford University. Teaching AI and Deep Learning to over 50,000 engineers globally.',
        website='https://sarahchen.ai',
        linkedin='https://linkedin.com/in/sarahchen-ai',
        twitter='https://twitter.com/sarahchen_ai'
    )
    InstructorProfile.objects.create(
        user=instructor_sarah,
        expertise='Artificial Intelligence, Deep Learning, PyTorch, LLMs',
        years_of_experience=12,
        total_students=28500,
        total_courses=4,
        average_rating=4.92,
        is_approved=True
    )

    instructor_marcus = User.objects.create_user(
        email='marcus.vance@learnsphere.com',
        username='marcusvance',
        password='InstructorPassword123!',
        first_name='Marcus',
        last_name='Vance',
        role=User.ROLE_INSTRUCTOR,
        bio='Staff Full-Stack Engineer with 14 years building high-concurrency cloud systems at Netflix and Stripe. Passionate educator simplifying complex systems architecture.',
        website='https://marcusvance.dev',
        linkedin='https://linkedin.com/in/marcusvance'
    )
    InstructorProfile.objects.create(
        user=instructor_marcus,
        expertise='Modern Full-Stack, React, Next.js, Django, Microservices',
        years_of_experience=14,
        total_students=34100,
        total_courses=4,
        average_rating=4.88,
        is_approved=True
    )

    instructor_elena = User.objects.create_user(
        email='elena.rostova@learnsphere.com',
        username='elenarostova',
        password='InstructorPassword123!',
        first_name='Elena',
        last_name='Rostova',
        role=User.ROLE_INSTRUCTOR,
        bio='Design Director & UX Strategist. Spearheaded design systems and accessible product design at Airbnb and Figma.',
        website='https://elenarostova.design',
        linkedin='https://linkedin.com/in/elenarostova'
    )
    InstructorProfile.objects.create(
        user=instructor_elena,
        expertise='UI/UX Design, Figma, Design Systems, UX Research',
        years_of_experience=10,
        total_students=18900,
        total_courses=2,
        average_rating=4.95,
        is_approved=True
    )

    instructor_david = User.objects.create_user(
        email='david.miller@learnsphere.com',
        username='davidmiller',
        password='InstructorPassword123!',
        first_name='David',
        last_name='Miller',
        role=User.ROLE_INSTRUCTOR,
        bio='Principal Cloud Architect & AWS Community Hero. Specializes in Kubernetes, Terraform, and resilient microservice architectures.',
        website='https://davidmiller.cloud'
    )
    InstructorProfile.objects.create(
        user=instructor_david,
        expertise='AWS, Kubernetes, DevOps, Cloud Architecture, Docker',
        years_of_experience=11,
        total_students=22400,
        total_courses=2,
        average_rating=4.84,
        is_approved=True
    )

    # Students
    student_alex = User.objects.create_user(
        email='alex.rivera@learnsphere.com',
        username='alexrivera',
        password='StudentPassword123!',
        first_name='Alex',
        last_name='Rivera',
        role=User.ROLE_STUDENT,
        bio='Software Engineering student passionate about full-stack web development and artificial intelligence.'
    )
    alex_profile = StudentProfile.objects.create(
        user=student_alex,
        learning_goals='Master modern full-stack web applications and land a software engineer role in EdTech.',
        total_learning_hours=42.5,
        streak_days=14,
        last_active=timezone.now()
    )

    student_priya = User.objects.create_user(
        email='priya.patel@learnsphere.com',
        username='priyapatel',
        password='StudentPassword123!',
        first_name='Priya',
        last_name='Patel',
        role=User.ROLE_STUDENT,
        bio='Data enthusiast transitioning into machine learning and neural networks.'
    )
    StudentProfile.objects.create(
        user=student_priya,
        learning_goals='Build and deploy production-grade LLM applications.',
        total_learning_hours=28.0,
        streak_days=7,
        last_active=timezone.now()
    )

    student_jordan = User.objects.create_user(
        email='jordan.lee@learnsphere.com',
        username='jordanlee',
        password='StudentPassword123!',
        first_name='Jordan',
        last_name='Lee',
        role=User.ROLE_STUDENT,
        bio='Product designer expanding into front-end design systems.'
    )
    StudentProfile.objects.create(
        user=student_jordan,
        learning_goals='Bridge the gap between Figma designs and React component libraries.',
        total_learning_hours=15.0,
        streak_days=4,
        last_active=timezone.now()
    )

    # 3. Create Categories
    print("📂 Creating categories...")
    cat_web = Category.objects.create(
        name='Web Development',
        slug='web-development',
        description='Master full-stack frameworks, RESTful APIs, responsive design, and production deployment.',
        icon='Code',
        color='#3b82f6',
        course_count=3
    )
    cat_ai = Category.objects.create(
        name='Artificial Intelligence',
        slug='artificial-intelligence',
        description='Dive deep into neural networks, PyTorch, large language models, and generative AI systems.',
        icon='Cpu',
        color='#8b5cf6',
        course_count=2
    )
    cat_ds = Category.objects.create(
        name='Data Science',
        slug='data-science',
        description='Transform messy raw data into predictive insights with Python, Pandas, SQL, and Scikit-Learn.',
        icon='BarChart2',
        color='#06b6d4',
        course_count=2
    )
    cat_design = Category.objects.create(
        name='UI/UX & Product Design',
        slug='ui-ux-design',
        description='Create intuitive user journeys, high-fidelity prototypes in Figma, and reusable design systems.',
        icon='Palette',
        color='#ec4899',
        course_count=2
    )
    cat_cloud = Category.objects.create(
        name='Cloud & DevOps',
        slug='cloud-devops',
        description='Containerize applications with Docker, orchestrate with Kubernetes, and deploy on AWS & GCP.',
        icon='Cloud',
        color='#f59e0b',
        course_count=2
    )
    cat_security = Category.objects.create(
        name='Cybersecurity',
        slug='cybersecurity',
        description='Learn ethical hacking, penetration testing, network defense, and secure software development.',
        icon='Shield',
        color='#ef4444',
        course_count=1
    )
    cat_business = Category.objects.create(
        name='Business & Tech Strategy',
        slug='business-strategy',
        description='Lead tech startups, master agile product management, and align software with business goals.',
        icon='TrendingUp',
        color='#10b981',
        course_count=1
    )

    # 4. Create 11 Rich Courses
    print("📚 Creating courses, modules, lessons, and quizzes...")

    courses_spec = [
        {
            'title': 'Full-Stack Web Development Bootcamp: React, Node & Django',
            'subtitle': 'Build real-world scalable web applications from scratch with modern React, TypeScript, and Django REST Framework.',
            'category': cat_web,
            'instructor': instructor_marcus,
            'level': Course.LEVEL_ALL,
            'price': 49.99,
            'is_free': False,
            'is_featured': True,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
            'learning_outcomes': [
                'Architect production-ready full-stack applications with React & Django REST Framework',
                'Master TypeScript for robust front-end component architectures and API contracts',
                'Implement secure JWT authentication, role-based access control, and refresh token rotation',
                'Design relational database schemas with PostgreSQL and optimize complex query sets',
                'Deploy full-stack web applications with Docker, Nginx, and cloud hosting platforms'
            ],
            'requirements': [
                'Basic understanding of HTML, CSS, and fundamental JavaScript',
                'A computer (Mac, Windows, or Linux) with a web browser and code editor installed'
            ],
            'tags': ['React', 'TypeScript', 'Django', 'Python', 'Full Stack', 'Web Development'],
            'modules': [
                {
                    'title': 'Module 1: Modern Frontend Architecture with React & TypeScript',
                    'description': 'Foundations of reactive component design, typed hooks, state patterns, and API integration.',
                    'lessons': [
                        {
                            'title': '1.1 Course Overview & Modern Web Architecture',
                            'duration': 18,
                            'video_url': 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
                            'content': 'Welcome to the Full-Stack Web Development Bootcamp. In this opening lesson, we explore the modern multi-tier web architecture: Single Page Applications (SPAs) communicating via RESTful JSON APIs to a robust backend service, backed by relational database persistence and Redis caching.',
                            'is_free_preview': True
                        },
                        {
                            'title': '1.2 TypeScript Essentials for React Developers',
                            'duration': 26,
                            'video_url': 'https://www.youtube.com/watch?v=gieEQFIfgYc',
                            'content': 'Discover why TypeScript is standard in production engineering. We cover strict typing for Props, State, Generic Event Handlers, and API response schemas to catch bugs at compile-time rather than runtime.',
                            'is_free_preview': True
                        },
                        {
                            'title': '1.3 State Management & Custom Hooks Pattern',
                            'duration': 32,
                            'video_url': 'https://www.youtube.com/watch?v=6ThXsUwLWvc',
                            'content': 'Deep dive into React state lifecycles: separating presentation components from business logic through custom hooks (useAuth, useFetch, useLocalStorage) and predictable state flows.',
                            'is_free_preview': False
                        }
                    ]
                },
                {
                    'title': 'Module 2: Robust Backend APIs with Django REST Framework',
                    'description': 'Building scalable RESTful web APIs, ORM migrations, serializer validation, and JWT security.',
                    'lessons': [
                        {
                            'title': '2.1 Django Project Setup & Custom User Model',
                            'duration': 28,
                            'video_url': 'https://www.youtube.com/watch?v=F5mRW0jo-U4',
                            'content': 'Best practices for organizing Django applications: AbstractUser customization, environment variable isolation, and database schema migrations.',
                            'is_free_preview': False
                        },
                        {
                            'title': '2.2 Serializers, ViewSets, and Role-Based Permissions',
                            'duration': 35,
                            'video_url': 'https://www.youtube.com/watch?v=c708Nf0cMrs',
                            'content': 'Crafting clean serializer hierarchies with validation rules, nested representations, and custom DRF permission classes like IsAdminUser and IsInstructorOrAdmin.',
                            'is_free_preview': False
                        },
                        {
                            'title': '2.3 JWT Authentication & Secure Session Handling',
                            'duration': 24,
                            'video_url': 'https://www.youtube.com/watch?v=PUzg8TQ60Ag',
                            'content': 'Implementing stateless JSON Web Tokens using SimpleJWT: access token expiration, token refresh rotation, and blacklisting on logout for top-tier security.',
                            'is_free_preview': False
                        }
                    ]
                },
                {
                    'title': 'Module 3: Database Optimization, Testing & Deployment',
                    'description': 'Database indexes, query optimization, end-to-end integration, and cloud production release.',
                    'lessons': [
                        {
                            'title': '3.1 Database Query Optimization & Indexing',
                            'duration': 30,
                            'video_url': 'https://www.youtube.com/watch?v=ztHopE5Wnpc',
                            'content': 'Eliminating N+1 queries using select_related and prefetch_related, database constraints, composite indexing, and database transaction atomicity.',
                            'is_free_preview': False
                        },
                        {
                            'title': '3.2 Production Deployment with Docker & CI/CD',
                            'duration': 40,
                            'video_url': 'https://www.youtube.com/watch?v=3c-iBn73dDE',
                            'content': 'Containerizing the full stack: multi-stage Dockerfiles for React and Django, Nginx reverse proxy configuration, environment isolation, and automated deployment pipelines.',
                            'is_free_preview': False
                        }
                    ]
                }
            ],
            'quiz': {
                'title': 'Full-Stack Engineering Assessment Quiz',
                'description': 'Demonstrate your knowledge of React, TypeScript, Django REST Framework, and database optimization.',
                'passing_score': 75,
                'time_limit_minutes': 15,
                'questions': [
                    {
                        'text': 'Which DRF queryset method eliminates N+1 query problems when fetching ForeignKey relations?',
                        'explanation': 'select_related() performs an SQL JOIN and includes the related object fields in the SELECT statement.',
                        'choices': [
                            ('select_related()', True),
                            ('filter_by_join()', False),
                            ('all_with_relations()', False),
                            ('prefetch_now()', False)
                        ]
                    },
                    {
                        'text': 'What is the primary benefit of JWT refresh token rotation?',
                        'explanation': 'Token rotation generates a new refresh token every time one is used, instantly invalidating stolen refresh tokens if re-used.',
                        'choices': [
                            ('It prevents replay attacks and detects stolen tokens by invalidating family chains', True),
                            ('It reduces the database file size', False),
                            ('It allows passwords to be stored on client machines', False),
                            ('It speeds up frontend CSS rendering', False)
                        ]
                    },
                    {
                        'text': 'In TypeScript, what keyword is used to create a type based on an existing interface with all fields made optional?',
                        'explanation': 'The Partial<T> utility type constructs a type with all properties of Type set to optional.',
                        'choices': [
                            ('Partial<T>', True),
                            ('Optional<T>', False),
                            ('Nullable<T>', False),
                            ('Draft<T>', False)
                        ]
                    },
                    {
                        'text': 'What does the HTTP status code 403 Forbidden indicate in a REST API?',
                        'explanation': '403 Forbidden signifies that the server understood the request and the user is authenticated, but lacks permissions for the action.',
                        'choices': [
                            ('The user is authenticated but not authorized to perform this action', True),
                            ('The requested URL endpoint does not exist', False),
                            ('The client failed to provide credentials altogether', False),
                            ('The database crashed during execution', False)
                        ]
                    }
                ]
            }
        },
        {
            'title': 'Artificial Intelligence & Deep Learning Masterclass',
            'subtitle': 'Master neural networks, PyTorch fundamentals, computer vision, natural language processing, and Transformers.',
            'category': cat_ai,
            'instructor': instructor_sarah,
            'level': Course.LEVEL_ADVANCED,
            'price': 69.99,
            'is_free': False,
            'is_featured': True,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=aircAruvnKk',
            'learning_outcomes': [
                'Understand mathematical foundations of gradient descent, backpropagation, and loss functions',
                'Build, train, and validate deep neural networks using PyTorch from scratch',
                'Construct Convolutional Neural Networks (CNNs) for image classification and feature extraction',
                'Implement Transformer attention mechanisms and fine-tune Large Language Models',
                'Deploy deep learning models with ONNX Runtime and FastAPI for production inference'
            ],
            'requirements': [
                'Working knowledge of Python programming (classes, functions, list comprehensions)',
                'High school level algebra and basic calculus concepts (derivatives and matrices)'
            ],
            'tags': ['AI', 'Deep Learning', 'PyTorch', 'Transformers', 'Machine Learning', 'Python'],
            'modules': [
                {
                    'title': 'Module 1: Foundations of Neural Networks & PyTorch',
                    'description': 'Tensors, computational graphs, autograd engine, and building your first multilayer perceptron.',
                    'lessons': [
                        {
                            'title': '1.1 Introduction to Deep Learning & Tensor Operations',
                            'duration': 22,
                            'video_url': 'https://www.youtube.com/watch?v=aircAruvnKk',
                            'content': 'We examine the core data structure of deep learning: the Tensor. Learn how GPU acceleration, broadcasting, and vectorization empower parallel computation across millions of weights simultaneously.',
                            'is_free_preview': True
                        },
                        {
                            'title': '1.2 Backpropagation & Gradient Descent Demystified',
                            'duration': 34,
                            'video_url': 'https://www.youtube.com/watch?v=IHZwWFHWa-w',
                            'content': 'Step-by-step walkthrough of the chain rule in calculus applied to multi-layered computational graphs. Understand loss landscapes, learning rates, momentum, and Adam optimizers.',
                            'is_free_preview': False
                        }
                    ]
                },
                {
                    'title': 'Module 2: Transformers & Modern Language Models',
                    'description': 'Self-attention, multi-head attention, positional encodings, and fine-tuning open weights.',
                    'lessons': [
                        {
                            'title': '2.1 The Transformer Architecture & Self-Attention',
                            'duration': 45,
                            'video_url': 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
                            'content': 'An in-depth breakdown of the "Attention Is All You Need" paper: Query, Key, and Value vectors, scaled dot-product attention, masking, and feed-forward layers.',
                            'is_free_preview': False
                        },
                        {
                            'title': '2.2 Fine-Tuning Open Source LLMs with LoRA',
                            'duration': 38,
                            'video_url': 'https://www.youtube.com/watch?v=e-GWJEP97_8',
                            'content': 'Parameter-Efficient Fine-Tuning (PEFT) using Low-Rank Adaptation (LoRA) and 4-bit quantization (QLoRA) to specialize models on private domain datasets.',
                            'is_free_preview': False
                        }
                    ]
                }
            ],
            'quiz': {
                'title': 'Neural Networks & Deep Learning Evaluation',
                'description': 'Test your grasp of PyTorch tensors, backprop, and Transformer mechanisms.',
                'passing_score': 70,
                'time_limit_minutes': 20,
                'questions': [
                    {
                        'text': 'What is the role of the Softmax function when placed at the final output layer of a multi-class neural network?',
                        'explanation': 'Softmax normalizes unnormalized logits into probabilities that sum to 1.0.',
                        'choices': [
                            ('Converts raw logits into a valid probability distribution summing to 1', True),
                            ('Zeros out negative weights to speed up training', False),
                            ('Prevents vanishing gradients during backward passes', False),
                            ('Encodes images into JPEG format', False)
                        ]
                    },
                    {
                        'text': 'In the Self-Attention mechanism, how is the attention weight matrix calculated?',
                        'explanation': 'Scaled dot product of Query and Key transpose divided by sqrt(d_k), followed by softmax.',
                        'choices': [
                            ('Softmax( (Q * K^T) / sqrt(d_k) )', True),
                            ('Sigmoid( Q + K + V )', False),
                            ('ReLU( Q * V^T )', False),
                            ('Q * K * V', False)
                        ]
                    }
                ]
            }
        },
        {
            'title': 'UI/UX Design Systems & High-Fidelity Prototyping in Figma',
            'subtitle': 'Master modern product design from wireframes to scalable Figma design systems, accessibility, and developer handoff.',
            'category': cat_design,
            'instructor': instructor_elena,
            'level': Course.LEVEL_BEGINNER,
            'price': 39.99,
            'is_free': False,
            'is_featured': True,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
            'learning_outcomes': [
                'Design intuitive, user-centric web and mobile interfaces using Figma',
                'Build cohesive design systems with variables, tokens, and auto-layout 5.0',
                'Conduct user research, synthesize customer journey maps, and wireframe rapidly',
                'Ensure WCAG AA accessibility compliance across typography, contrast, and focus states',
                'Seamlessly hand off specifications and component guidelines to front-end engineers'
            ],
            'requirements': [
                'No prior design experience required. Free Figma account needed.'
            ],
            'tags': ['UI/UX', 'Figma', 'Design Systems', 'Product Design', 'Prototyping'],
            'modules': [
                {
                    'title': 'Module 1: Figma Fundamentals & Auto-Layout',
                    'description': 'Master vectors, responsive auto-layout framing, constraints, and typography scales.',
                    'lessons': [
                        {
                            'title': '1.1 Principles of Human-Centered UI/UX Design',
                            'duration': 20,
                            'video_url': 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
                            'content': 'Discover Hick\'s Law, Fitts\'s Law, visual hierarchy, and whitespace usage to create interfaces that users understand instantly.',
                            'is_free_preview': True
                        },
                        {
                            'title': '1.2 Advanced Auto-Layout & Component Variants',
                            'duration': 35,
                            'video_url': 'https://www.youtube.com/watch?v=NrKX46DzkGQ',
                            'content': 'Build real-world buttons, input fields, navigation headers, and modal cards with component property toggles and responsive resize behaviors.',
                            'is_free_preview': False
                        }
                    ]
                },
                {
                    'title': 'Module 2: Design Tokens & Systems at Scale',
                    'description': 'Creating tokenized color palettes, typography scales, spacing variables, and dark mode themes.',
                    'lessons': [
                        {
                            'title': '2.1 Tokens, Variables & Theme Switching',
                            'duration': 30,
                            'video_url': 'https://www.youtube.com/watch?v=4W4LvK4b8cE',
                            'content': 'How top tech companies implement multi-brand and dark/light mode switching through alias tokens and Figma variables.',
                            'is_free_preview': False
                        }
                    ]
                }
            ],
            'quiz': {
                'title': 'UI/UX Design Systems Mastery',
                'description': 'Check your comprehension of UX principles, auto-layout, and accessibility.',
                'passing_score': 70,
                'time_limit_minutes': 15,
                'questions': [
                    {
                        'text': 'According to WCAG 2.1 AA standards, what is the minimum contrast ratio required for normal body text against its background?',
                        'explanation': 'Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.',
                        'choices': [
                            ('4.5:1', True),
                            ('2.0:1', False),
                            ('7.0:1', False),
                            ('10:1', False)
                        ]
                    }
                ]
            }
        },
        {
            'title': 'Cloud Engineering & Kubernetes Microservices with AWS',
            'subtitle': 'Deploy, scale, and monitor distributed applications using Docker, Kubernetes, Terraform, and AWS cloud infrastructure.',
            'category': cat_cloud,
            'instructor': instructor_david,
            'level': Course.LEVEL_INTERMEDIATE,
            'price': 59.99,
            'is_free': False,
            'is_featured': True,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=X48VuDVv0do',
            'learning_outcomes': [
                'Architect secure, fault-tolerant infrastructure on AWS with VPCs and IAM',
                'Containerize multi-service applications using multi-stage Docker builds',
                'Orchestrate workloads with Kubernetes Pods, Deployments, Services, and Ingress',
                'Automate infrastructure provisioning declaratively using Terraform HCL',
                'Implement Prometheus and Grafana for observability and health telemetry'
            ],
            'requirements': [
                'Familiarity with the command line / bash terminal',
                'Basic understanding of networking (IPs, DNS, ports, HTTP)'
            ],
            'tags': ['AWS', 'Kubernetes', 'Docker', 'DevOps', 'Terraform', 'Cloud'],
            'modules': [
                {
                    'title': 'Module 1: Docker Containers & Multi-Stage Builds',
                    'description': 'Building lean container images, volume mounts, and Docker Compose networks.',
                    'lessons': [
                        {
                            'title': '1.1 Docker Internals & Containerization Best Practices',
                            'duration': 25,
                            'video_url': 'https://www.youtube.com/watch?v=X48VuDVv0do',
                            'content': 'Understand namespaces, cgroups, layered file systems, and how to write non-root, ultra-small Alpine-based Dockerfiles for Node and Python.',
                            'is_free_preview': True
                        }
                    ]
                },
                {
                    'title': 'Module 2: Production Kubernetes Clusters on EKS',
                    'description': 'Deploying real microservices on AWS Elastic Kubernetes Service with zero-downtime rolling updates.',
                    'lessons': [
                        {
                            'title': '2.1 Kubernetes Architecture: Control Plane & Nodes',
                            'duration': 35,
                            'video_url': 'https://www.youtube.com/watch?v=VnvRFRk_51k',
                            'content': 'Walkthrough of kube-apiserver, etcd, scheduler, kubelet, and how reconciliation loops maintain desired cluster state.',
                            'is_free_preview': False
                        }
                    ]
                }
            ],
            'quiz': {
                'title': 'Cloud & DevOps Architecture Quiz',
                'description': 'Evaluate your containerization and orchestration proficiency.',
                'passing_score': 70,
                'time_limit_minutes': 15,
                'questions': [
                    {
                        'text': 'Which Kubernetes object provides a single, stable IP address and DNS name to route traffic across dynamic Pods?',
                        'explanation': 'A Kubernetes Service abstracts access to an arbitrary set of Pods.',
                        'choices': [
                            ('Service', True),
                            ('Deployment', False),
                            ('ConfigMap', False),
                            ('Namespace', False)
                        ]
                    }
                ]
            }
        },
        {
            'title': 'Data Science & Machine Learning with Python & Pandas',
            'subtitle': 'Clean, explore, visualize, and predict real-world datasets with Python, NumPy, Pandas, Matplotlib, and Scikit-Learn.',
            'category': cat_ds,
            'instructor': instructor_sarah,
            'level': Course.LEVEL_BEGINNER,
            'price': 0.00,
            'is_free': True,
            'is_featured': True,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
            'learning_outcomes': [
                'Perform data manipulation and feature engineering using Pandas DataFrames',
                'Create high-impact statistical visualizations with Matplotlib and Seaborn',
                'Train supervised regression and classification models using Scikit-Learn',
                'Evaluate model accuracy with cross-validation, confusion matrices, and ROC curves',
                'Communicate analytical findings through interactive Jupyter Notebooks'
            ],
            'requirements': [
                'Basic familiarity with Python variables and loops'
            ],
            'tags': ['Data Science', 'Python', 'Pandas', 'Machine Learning', 'Data Analysis'],
            'modules': [
                {
                    'title': 'Module 1: Exploratory Data Analysis with Pandas',
                    'description': 'Handling missing data, grouping, pivoting, and aggregation techniques.',
                    'lessons': [
                        {
                            'title': '1.1 Wrangling Tabular Data with Pandas',
                            'duration': 30,
                            'video_url': 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
                            'content': 'Loading CSV and SQL data, handling NaN values, applying vectorized functions, and performing multi-index aggregations.',
                            'is_free_preview': True
                        }
                    ]
                }
            ],
            'quiz': {
                'title': 'Data Science Fundamentals Quiz',
                'description': 'Validate your understanding of Pandas DataFrames and data manipulation.',
                'passing_score': 70,
                'time_limit_minutes': 10,
                'questions': [
                    {
                        'text': 'Which Pandas method is used to compute summary statistics (mean, std, min, quartiles) for numeric columns?',
                        'explanation': 'describe() outputs summary statistics for numerical DataFrame columns.',
                        'choices': [
                            ('df.describe()', True),
                            ('df.summary()', False),
                            ('df.stats()', False),
                            ('df.info_all()', False)
                        ]
                    }
                ]
            }
        },
        {
            'title': 'Ethical Hacking & Network Penetration Testing',
            'subtitle': 'Practical cybersecurity techniques: reconnaissance, vulnerability scanning, exploit frameworks, and defensive hardening.',
            'category': cat_security,
            'instructor': instructor_david,
            'level': Course.LEVEL_INTERMEDIATE,
            'price': 54.99,
            'is_free': False,
            'is_featured': False,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
            'learning_outcomes': [
                'Conduct systematic network scanning with Nmap and Wireshark packet analysis',
                'Identify OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF) in web apps',
                'Safely leverage Metasploit framework in virtual sandbox environments',
                'Configure firewalls, IDS/IPS, and apply modern cryptographic standards'
            ],
            'requirements': [
                'Understanding of TCP/IP networking and operating systems'
            ],
            'tags': ['Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Security'],
            'modules': [
                {
                    'title': 'Module 1: Reconnaissance & Network Discovery',
                    'description': 'Scanning ports, banner grabbing, and identifying attack surfaces.',
                    'lessons': [
                        {
                            'title': '1.1 Port Scanning & TCP Handshake Analysis with Nmap',
                            'duration': 28,
                            'video_url': 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
                            'content': 'SYN scans vs Connect scans, OS fingerprinting, NSE script automation, and analyzing packet captures.',
                            'is_free_preview': True
                        }
                    ]
                }
            ],
            'quiz': None
        },
        {
            'title': 'Tech Startup Strategy & Agile Product Management',
            'subtitle': 'Transform engineering ideas into scalable market products: customer discovery, roadmaps, unit economics, and team execution.',
            'category': cat_business,
            'instructor': instructor_marcus,
            'level': Course.LEVEL_BEGINNER,
            'price': 34.99,
            'is_free': False,
            'is_featured': False,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=kYv9qU0z8iQ',
            'learning_outcomes': [
                'Validate minimum viable products (MVPs) using data-backed customer interviews',
                'Define clear product OKRs, user stories, sprint backlogs, and roadmap milestones',
                'Analyze unit economics: Customer Acquisition Cost (CAC) vs Lifetime Value (LTV)',
                'Bridge communication between software engineers, design leads, and executive stakeholders'
            ],
            'requirements': ['Curiosity for technology entrepreneurship and product thinking'],
            'tags': ['Business', 'Product Management', 'Startup', 'Agile', 'Strategy'],
            'modules': [
                {
                    'title': 'Module 1: Customer Discovery & MVP Hypothesis Testing',
                    'description': 'Validating market need before writing code.',
                    'lessons': [
                        {
                            'title': '1.1 Formulating Problem-Solution Fit Hypotheses',
                            'duration': 20,
                            'video_url': 'https://www.youtube.com/watch?v=kYv9qU0z8iQ',
                            'content': 'How to conduct Mom Test interviews, test value propositions with low-cost landing pages, and measure early user engagement.',
                            'is_free_preview': True
                        }
                    ]
                }
            ],
            'quiz': None
        },
        {
            'title': 'Advanced TypeScript & Enterprise Clean Architecture',
            'subtitle': 'Master advanced generics, conditional types, Domain Driven Design (DDD), and SOLID design principles in TypeScript.',
            'category': cat_web,
            'instructor': instructor_marcus,
            'level': Course.LEVEL_ADVANCED,
            'price': 44.99,
            'is_free': False,
            'is_featured': False,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=gieEQFIfgYc',
            'learning_outcomes': [
                'Utilize advanced conditional types, template literal types, and mapped types',
                'Implement Clean Architecture layers: Entities, Use Cases, Repositories, Presenters',
                'Apply dependency inversion and inversion of control containers in large codebases'
            ],
            'requirements': ['Intermediate knowledge of TypeScript and JavaScript'],
            'tags': ['TypeScript', 'Architecture', 'Clean Code', 'Web Development'],
            'modules': [
                {
                    'title': 'Module 1: Advanced Type System Mastery',
                    'description': 'Type-level programming, inference, and branded types.',
                    'lessons': [
                        {
                            'title': '1.1 Deep Dive into Conditional & Template Literal Types',
                            'duration': 25,
                            'video_url': 'https://www.youtube.com/watch?v=gieEQFIfgYc',
                            'content': 'How to construct type-safe SQL query builders and nested object path pickers using conditional type recursion.',
                            'is_free_preview': True
                        }
                    ]
                }
            ],
            'quiz': None
        },
        {
            'title': 'Applied Large Language Models: LangChain & RAG Systems',
            'subtitle': 'Build production Retrieval-Augmented Generation (RAG) applications with vector databases, embeddings, and LangChain.',
            'category': cat_ai,
            'instructor': instructor_sarah,
            'level': Course.LEVEL_INTERMEDIATE,
            'price': 64.99,
            'is_free': False,
            'is_featured': True,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=aywZrzNaKjs',
            'learning_outcomes': [
                'Build semantic search engines using ChromaDB and Pinecone vector stores',
                'Implement chunking strategies and hybrid dense-sparse retrieval techniques',
                'Create AI agent tool-calling workflows using LangGraph and LangChain'
            ],
            'requirements': ['Python proficiency and foundational knowledge of machine learning'],
            'tags': ['LLM', 'LangChain', 'RAG', 'AI', 'Vector Databases'],
            'modules': [
                {
                    'title': 'Module 1: Vector Embeddings & Document Retrieval',
                    'description': 'Text splitting, embedding models, cosine similarity, and nearest neighbors.',
                    'lessons': [
                        {
                            'title': '1.1 End-to-End RAG Architecture Overview',
                            'duration': 30,
                            'video_url': 'https://www.youtube.com/watch?v=aywZrzNaKjs',
                            'content': 'From unstructured PDF ingestion through chunking, vector indexing, query transformation, and grounded synthesis.',
                            'is_free_preview': True
                        }
                    ]
                }
            ],
            'quiz': None
        },
        {
            'title': 'React Native & Expo: Build Cross-Platform Mobile Apps',
            'subtitle': 'Ship iOS and Android applications from a single TypeScript codebase with native animations, push notifications, and offline caching.',
            'category': cat_web,
            'instructor': instructor_marcus,
            'level': Course.LEVEL_INTERMEDIATE,
            'price': 49.99,
            'is_free': False,
            'is_featured': False,
            'status': Course.STATUS_PUBLISHED,
            'thumbnail_url': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
            'learning_outcomes': [
                'Build reactive mobile UIs that run natively on iOS and Android with Expo Router',
                'Integrate native device sensors, camera permissions, and secure local keychain storage',
                'Handle offline synchronization and state persistence with React Query'
            ],
            'requirements': ['Solid knowledge of React and JavaScript / TypeScript'],
            'tags': ['Mobile', 'React Native', 'Expo', 'iOS', 'Android'],
            'modules': [
                {
                    'title': 'Module 1: Expo Router & Navigation Stacks',
                    'description': 'File-based routing for native mobile applications.',
                    'lessons': [
                        {
                            'title': '1.1 Setting up Expo and Native Navigation',
                            'duration': 22,
                            'video_url': 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
                            'content': 'Getting started with file-based layout routing, tabs, and modals using Expo Router v3.',
                            'is_free_preview': True
                        }
                    ]
                }
            ],
            'quiz': None
        },
        {
            'title': 'Modern GraphQL APIs with Python & Strawberry',
            'subtitle': 'Design strongly typed, high-performance GraphQL endpoints, queries, mutations, and real-time subscriptions in Python.',
            'category': cat_web,
            'instructor': instructor_marcus,
            'level': Course.LEVEL_INTERMEDIATE,
            'price': 29.99,
            'is_free': False,
            'is_featured': False,
            'status': Course.STATUS_PENDING,  # Under review demo course for Admin workflow!
            'thumbnail_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
            'preview_video_url': 'https://www.youtube.com/watch?v=c708Nf0cMrs',
            'learning_outcomes': [
                'Write strongly-typed GraphQL schemas using Python dataclasses',
                'Eliminate N+1 problems with DataLoader batching',
                'Implement real-time WebSocket subscriptions'
            ],
            'requirements': ['Python experience and basic API concepts'],
            'tags': ['GraphQL', 'Python', 'APIs', 'Strawberry'],
            'modules': [
                {
                    'title': 'Module 1: GraphQL Schemas & Type Resolvers',
                    'description': 'Schema design vs REST tradeoffs.',
                    'lessons': [
                        {
                            'title': '1.1 Why GraphQL? Schema Definition & First Queries',
                            'duration': 20,
                            'video_url': 'https://www.youtube.com/watch?v=c708Nf0cMrs',
                            'content': 'Comparing REST endpoint waterfalls against client-specified GraphQL payloads.',
                            'is_free_preview': True
                        }
                    ]
                }
            ],
            'quiz': None
        }
    ]

    created_courses = []

    for c_data in courses_spec:
        modules_data = c_data.pop('modules', [])
        quiz_data = c_data.pop('quiz', None)

        course = Course.objects.create(
            instructor=c_data['instructor'],
            category=c_data['category'],
            title=c_data['title'],
            subtitle=c_data['subtitle'],
            description=f"### About This Course\n\n{c_data['subtitle']}\n\nThis course is meticulously designed for software professionals seeking actionable, real-world skills. You will build comprehensive projects, write clean code, and gain deep intuitive understanding through hands-on exercises.\n\n### What You Will Build\n- Production-ready applications with test coverage\n- Clean architecture adhering to industry best practices\n- Capstone portfolio projects ready for presentation\n\n### Who This Course Is For\nDevelopers, architects, and engineering students who want to accelerate their technical growth.",
            thumbnail_url=c_data['thumbnail_url'],
            preview_video_url=c_data['preview_video_url'],
            level=c_data['level'],
            price=c_data['price'],
            is_free=c_data['is_free'],
            is_featured=c_data['is_featured'],
            status=c_data['status'],
            learning_outcomes=c_data['learning_outcomes'],
            requirements=c_data['requirements'],
            tags=c_data['tags'],
            published_at=timezone.now() if c_data['status'] == Course.STATUS_PUBLISHED else None
        )

        total_lessons_count = 0
        total_minutes = 0

        for m_idx, m_data in enumerate(modules_data):
            module = Module.objects.create(
                course=course,
                title=m_data['title'],
                description=m_data['description'],
                order=m_idx + 1
            )
            for l_idx, l_data in enumerate(m_data['lessons']):
                total_lessons_count += 1
                total_minutes += l_data['duration']
                lesson = Lesson.objects.create(
                    module=module,
                    title=l_data['title'],
                    lesson_type=Lesson.TYPE_VIDEO,
                    content=l_data['content'],
                    video_url=l_data['video_url'],
                    duration_minutes=l_data['duration'],
                    order=l_idx + 1,
                    is_free_preview=l_data['is_free_preview'],
                    resources=[
                        {'name': f"Lecture Notes - {l_data['title']}.pdf", 'url': 'https://learnsphere.io/resources/notes.pdf', 'type': 'pdf'},
                        {'name': 'Source Code & Starter Repository', 'url': 'https://github.com/learnsphere-edtech/course-resources', 'type': 'github'}
                    ]
                )

        course.total_lessons = total_lessons_count
        course.duration_hours = round(total_minutes / 60, 1)
        course.save()

        # Add Quiz if defined
        if quiz_data and course.modules.exists():
            first_module = course.modules.first()
            first_lesson = first_module.lessons.first() if first_module.lessons.exists() else None

            quiz = Quiz.objects.create(
                course=course,
                lesson=first_lesson,
                title=quiz_data['title'],
                description=quiz_data['description'],
                time_limit_minutes=quiz_data['time_limit_minutes'],
                passing_score=quiz_data['passing_score'],
                max_attempts=3
            )
            for q_idx, q_item in enumerate(quiz_data['questions']):
                question = Question.objects.create(
                    quiz=quiz,
                    question_text=q_item['text'],
                    explanation=q_item['explanation'],
                    order=q_idx + 1,
                    points=10
                )
                for c_idx, (choice_text, is_correct) in enumerate(q_item['choices']):
                    Choice.objects.create(
                        question=question,
                        choice_text=choice_text,
                        is_correct=is_correct,
                        order=c_idx + 1
                    )

        created_courses.append(course)

    # 5. Create Realistic Student Enrollments, Progress, and Certificates
    print("🎓 Creating enrollments, progress, and certificates...")
    bootcamp_course = created_courses[0]  # Full-Stack Bootcamp
    ai_course = created_courses[1]        # AI Deep Learning
    design_course = created_courses[2]    # UI/UX Figma
    data_course = created_courses[4]      # Data Science (Free)

    # Alex Rivera: Completed UI/UX Course (100% complete + Certificate!)
    enrollment_alex_completed = Enrollment.objects.create(
        student=student_alex,
        course=design_course,
        status=Enrollment.STATUS_COMPLETED,
        completion_percentage=100.0,
        enrolled_at=timezone.now() - timedelta(days=20),
        completed_at=timezone.now() - timedelta(days=2),
        amount_paid=design_course.price
    )
    for m in design_course.modules.all():
        for l in m.lessons.all():
            LessonProgress.objects.create(
                enrollment=enrollment_alex_completed,
                lesson=l,
                is_completed=True,
                completed_at=timezone.now() - timedelta(days=3),
                watch_time_seconds=l.duration_minutes * 60
            )

    # Issue Certificate to Alex Rivera
    cert_alex = Certificate.objects.create(
        enrollment=enrollment_alex_completed,
        certificate_id=uuid.uuid4(),
        issued_at=timezone.now() - timedelta(days=2)
    )

    # Alex Rivera: In-Progress Full-Stack Course (60% complete)
    enrollment_alex_inprogress = Enrollment.objects.create(
        student=student_alex,
        course=bootcamp_course,
        status=Enrollment.STATUS_ACTIVE,
        completion_percentage=62.5,
        enrolled_at=timezone.now() - timedelta(days=12),
        last_accessed_at=timezone.now() - timedelta(hours=3),
        amount_paid=bootcamp_course.price
    )
    # Mark first 5 lessons completed
    all_bootcamp_lessons = Lesson.objects.filter(module__course=bootcamp_course).order_by('module__order', 'order')
    for l in all_bootcamp_lessons[:5]:
        LessonProgress.objects.create(
            enrollment=enrollment_alex_inprogress,
            lesson=l,
            is_completed=True,
            completed_at=timezone.now() - timedelta(days=1),
            watch_time_seconds=l.duration_minutes * 60
        )
    enrollment_alex_inprogress.last_accessed_lesson = all_bootcamp_lessons[4]
    enrollment_alex_inprogress.save()

    # Alex Rivera: Quiz Attempt on Bootcamp course
    bootcamp_quiz = Quiz.objects.filter(course=bootcamp_course).first()
    if bootcamp_quiz:
        attempt = QuizAttempt.objects.create(
            student=student_alex,
            quiz=bootcamp_quiz,
            enrollment=enrollment_alex_inprogress,
            status=QuizAttempt.STATUS_COMPLETED,
            score=100.0,
            total_points=40,
            earned_points=40,
            passed=True,
            completed_at=timezone.now() - timedelta(days=1)
        )
        for q in bootcamp_quiz.questions.all():
            correct_choice = q.choices.filter(is_correct=True).first()
            QuizAnswer.objects.create(
                attempt=attempt,
                question=q,
                selected_choice=correct_choice,
                is_correct=True
            )

    # Priya Patel: Enrolled in AI Course & Data Science
    enrollment_priya_ai = Enrollment.objects.create(
        student=student_priya,
        course=ai_course,
        status=Enrollment.STATUS_ACTIVE,
        completion_percentage=50.0,
        enrolled_at=timezone.now() - timedelta(days=8),
        amount_paid=ai_course.price
    )
    for l in Lesson.objects.filter(module__course=ai_course)[:2]:
        LessonProgress.objects.create(
            enrollment=enrollment_priya_ai,
            lesson=l,
            is_completed=True,
            completed_at=timezone.now() - timedelta(days=2),
            watch_time_seconds=l.duration_minutes * 60
        )

    enrollment_priya_ds = Enrollment.objects.create(
        student=student_priya,
        course=data_course,
        status=Enrollment.STATUS_ACTIVE,
        completion_percentage=100.0,
        enrolled_at=timezone.now() - timedelta(days=15),
        completed_at=timezone.now() - timedelta(days=5),
        amount_paid=0.00
    )
    for l in Lesson.objects.filter(module__course=data_course):
        LessonProgress.objects.create(
            enrollment=enrollment_priya_ds,
            lesson=l,
            is_completed=True,
            completed_at=timezone.now() - timedelta(days=5),
            watch_time_seconds=l.duration_minutes * 60
        )
    Certificate.objects.create(
        enrollment=enrollment_priya_ds,
        certificate_id=uuid.uuid4(),
        issued_at=timezone.now() - timedelta(days=5)
    )

    # Jordan Lee: Enrolled in Full-Stack Bootcamp
    Enrollment.objects.create(
        student=student_jordan,
        course=bootcamp_course,
        status=Enrollment.STATUS_ACTIVE,
        completion_percentage=25.0,
        enrolled_at=timezone.now() - timedelta(days=3),
        amount_paid=bootcamp_course.price
    )

    # Update course enrollment counts and ratings
    for c in Course.objects.all():
        c.total_students = c.enrollments.count()
        c.save()

    # 6. Create Bookmarks
    print("🔖 Creating bookmarks...")
    Bookmark.objects.create(user=student_alex, course=ai_course)
    Bookmark.objects.create(user=student_alex, course=created_courses[3]) # Cloud
    Bookmark.objects.create(user=student_priya, course=bootcamp_course)

    # 7. Create Reviews
    print("⭐ Creating reviews...")
    Review.objects.create(
        student=student_alex,
        course=design_course,
        enrollment=enrollment_alex_completed,
        rating=5,
        comment="Elena's design systems course is masterclass level! The explanation of variables, token hierarchies, and auto-layout transformed how I collaborate with developers."
    )
    Review.objects.create(
        student=student_priya,
        course=design_course,
        rating=5,
        comment="Clear, actionable, and visually inspiring. Every designer and front-end dev should take this."
    )
    Review.objects.create(
        student=student_alex,
        course=bootcamp_course,
        enrollment=enrollment_alex_inprogress,
        rating=5,
        comment="Marcus has a gift for making complex topics like JWT refresh rotation and relational query optimization feel intuitive. Outstanding curriculum."
    )
    Review.objects.create(
        student=student_priya,
        course=data_course,
        enrollment=enrollment_priya_ds,
        rating=5,
        comment="The best introduction to Pandas and exploratory data analysis. The notebook exercises were super practical."
    )

    # 8. Create Notifications
    print("🔔 Creating notifications...")
    Notification.objects.create(
        user=student_alex,
        notification_type=Notification.TYPE_CERTIFICATE,
        title='Congratulations on Your Certificate!',
        message=f'You have successfully completed UI/UX Design Systems & High-Fidelity Prototyping in Figma. Your official certificate ({cert_alex.certificate_id}) is ready to view and download.',
        link=f'/certificates',
        is_read=False
    )
    Notification.objects.create(
        user=student_alex,
        notification_type=Notification.TYPE_QUIZ_RESULT,
        title='Quiz Passed: 100% Score',
        message='You scored 100% on the Full-Stack Engineering Assessment Quiz!',
        link='/my-learning',
        is_read=True
    )
    Notification.objects.create(
        user=admin_user,
        notification_type=Notification.TYPE_COURSE_APPROVED,
        title='New Course Submitted for Review',
        message='Marcus Vance submitted "Modern GraphQL APIs with Python & Strawberry" for review.',
        link='/admin/courses',
        is_read=False
    )

    print("\n✅ LearnSphere Database Seeding Complete!")
    print("=" * 60)
    print("DEMO CREDENTIALS:")
    print("Admin:       admin@learnsphere.com     / AdminPassword123!")
    print("Instructor:  marcus.vance@learnsphere.com / InstructorPassword123!")
    print("Instructor:  sarah.chen@learnsphere.com   / InstructorPassword123!")
    print("Student:     alex.rivera@learnsphere.com  / StudentPassword123!")
    print("Student:     priya.patel@learnsphere.com  / StudentPassword123!")
    print("=" * 60)

if __name__ == '__main__':
    run_seed()
