from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

# SQLite database URL
DATABASE_URL = "sqlite+aiosqlite:///./graphene_composite.db"

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Async session maker
async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session


async def init_db():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)










