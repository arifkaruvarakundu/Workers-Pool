from decimal import Decimal
from authentication.models import User
from rest_framework.views import APIView
from django.utils import timezone
from .models import *
from services.models import Appointment
from django.db.models import Sum
from rest_framework.response import Response

class DashBoardView(APIView):
    def get(self, request):
        # Count the number of users
        total_users = User.objects.count()
        total_workers = User.objects.filter(role='worker').count()

        total_credits = Decimal(0.00)
        total_debits = Decimal(0.00)
        wallet_entries = AdminWallet.objects.all()

        print("&&&&&&&&&&&&&&&&&&(((((((((((())))))))))))",wallet_entries)

        today = timezone.now()
        start_of_week = today - timezone.timedelta(days=today.weekday())
        start_of_month = today.replace(day=1)
        start_of_year = today.replace(month=1, day=1)

        for entry in wallet_entries:
            total_credits += entry.credit
            total_debits += entry.debit

        total_balance = total_credits - total_debits



        week_entries = wallet_entries.filter(created_at__gte=start_of_week)
        month_entries = wallet_entries.filter(created_at__gte=start_of_month)
        year_entries = wallet_entries.filter(created_at__gte=start_of_year)

        total_revenue_week = sum(entry.credit for entry in week_entries) - sum(entry.debit for entry in week_entries)
        total_revenue_month = sum(entry.credit for entry in month_entries) - sum(entry.debit for entry in month_entries)
        total_revenue_year = sum(entry.credit for entry in year_entries) - sum(entry.debit for entry in year_entries)
        
        Pending_Bookings = Appointment.objects.filter(status='Pending').count()
        Accepted_Bookings = Appointment.objects.filter(status='Accepted').count()
        Cancelled_Bookings = Appointment.objects.filter(status='Cancelled').count()
        Rejected_Bookings = Appointment.objects.filter(status='Rejected').count()

        today_entries = wallet_entries.filter(created_at__date=today)
        total_revenue_today = sum(entry.credit - entry.debit for entry in today_entries)
        seven_days_ago = today - timezone.timedelta(days=7)
        daily_Bookings_data = []
        daily_revenue_data = []

        for i in range(7):
            day_start = seven_days_ago + timezone.timedelta(days=i)
            day_end = day_start + timezone.timedelta(days=1)

        Appointments_on_day = Appointment.objects.filter(date1__gte=day_start, date1__lt=day_end).count()


        revenue_on_day = wallet_entries.filter(created_at__date=day_start).aggregate(
                total_credit=Sum('credit'),
                total_debit=Sum('debit')
        )
        print("******************************",revenue_on_day)
        if revenue_on_day['total_credit'] is not None and revenue_on_day['total_debit'] is not None:
            revenue_on_day = revenue_on_day['total_credit'] - revenue_on_day['total_debit']
        else:
            revenue_on_day = 0

        daily_Bookings_data.append(Appointments_on_day)
        daily_revenue_data.append(revenue_on_day)

        response_data = {
            "total_users": total_users,
            "total_workers": total_workers,
            "total_balance": total_balance,
            "total_revenue_week": total_revenue_week,
            "total_revenue_month": total_revenue_month,
            "total_revenue_year": total_revenue_year,
            "pending_bookings": Pending_Bookings,
            "accepted_bookings": Accepted_Bookings,
            "cancelled_bookings": Cancelled_Bookings,
            "rejected_bookings": Rejected_Bookings,
            "total_revenue_today": total_revenue_today,
            "daily_Bookings_data":daily_Bookings_data,
            "daily_revenue_data":daily_revenue_data
        }

        return Response(response_data)





