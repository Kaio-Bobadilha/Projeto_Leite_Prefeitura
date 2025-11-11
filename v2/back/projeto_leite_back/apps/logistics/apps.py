from django.apps import AppConfig

class LogisticsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # Define o nome completo do módulo (o Django precisa disso)
    name = 'apps.logistics'
    # Define o 'label' único (o nome curto do app)
    label = 'logistics'