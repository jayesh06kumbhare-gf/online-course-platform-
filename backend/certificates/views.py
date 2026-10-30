from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Certificate
from .serializers import CertificateSerializer


class MyCertificatesView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(
            enrollment__student=self.request.user, is_valid=True
        ).select_related('enrollment__course', 'enrollment__student')


class CertificateVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, certificate_id):
        try:
            cert = Certificate.objects.get(certificate_id=certificate_id, is_valid=True)
            return Response(CertificateSerializer(cert).data)
        except Certificate.DoesNotExist:
            return Response({'error': 'Certificate not found or invalid.'}, status=status.HTTP_404_NOT_FOUND)
