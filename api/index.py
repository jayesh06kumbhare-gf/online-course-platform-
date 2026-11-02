"""
Vercel Serverless Function entry point for LearnSphere Django backend.
"""
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
BACKEND_DIR = PROJECT_ROOT / 'backend'

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnsphere.settings')

# Mark environment as Vercel
os.environ['VERCEL'] = '1'

from django.core.wsgi import get_wsgi_application

django_app = get_wsgi_application()

def app(environ, start_response):
    """
    WSGI wrapper ensuring PATH_INFO routing behaves consistently on Vercel.
    """
    path_info = environ.get('PATH_INFO', '')
    if (
        path_info
        and not path_info.startswith('/api')
        and not path_info.startswith('/admin')
        and not path_info.startswith('/static')
        and not path_info.startswith('/media')
    ):
        environ['PATH_INFO'] = '/api' + path_info
    return django_app(environ, start_response)

