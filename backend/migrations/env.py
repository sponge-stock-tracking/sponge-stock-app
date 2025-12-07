from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from app.core.database import Base
from app.core.config import settings
from sqlalchemy import create_engine
from app.core.database import Base
import app.models.users
import app.models.sponges
import app.models.stocks
import app.models.reports

target_metadata = Base.metadata

# Alembic Config objesi (alembic.ini ile ilişkilidir)
config = context.config

# Log konfigürasyonu
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Model meta bilgisi
target_metadata = Base.metadata

# Alembic'e environment değişkeninden gelen DATABASE_URL'i aktar
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

def run_migrations_offline() -> None:
    """Offline migration: engine oluşturulmadan SQL komutlarını hazırlar."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Online migration: engine oluşturulur, Supabase'e bağlanılır."""
    connectable = create_engine(settings.DATABASE_URL, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
