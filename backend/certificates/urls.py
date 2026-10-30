from django.urls import path
from . import views

urlpatterns = [
    path('my/', views.MyCertificatesView.as_view(), name='my_certificates'),
    path('verify/<uuid:certificate_id>/', views.CertificateVerifyView.as_view(), name='verify_certificate'),
]
