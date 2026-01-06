from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_session
from app.models import GrapheneSupplier, GrapheneSupplierBase, FiberSupplier, FiberSupplierBase

router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    contact: Optional[str] = None
    product_types: Optional[str] = None
    fiber_types: Optional[str] = None
    notes: Optional[str] = None


@router.post("/graphene", response_model=GrapheneSupplier, status_code=status.HTTP_201_CREATED)
async def create_graphene_supplier(
    supplier: GrapheneSupplierBase,
    session: AsyncSession = Depends(get_session)
):
    db_supplier = GrapheneSupplier.model_validate(supplier)
    session.add(db_supplier)
    await session.commit()
    await session.refresh(db_supplier)
    return db_supplier


@router.get("/graphene", response_model=List[GrapheneSupplier])
async def read_graphene_suppliers(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    query = select(GrapheneSupplier).offset(skip).limit(limit)
    result = await session.execute(query)
    suppliers = result.scalars().all()
    return suppliers


@router.post("/fiber", response_model=FiberSupplier, status_code=status.HTTP_201_CREATED)
async def create_fiber_supplier(
    supplier: FiberSupplierBase,
    session: AsyncSession = Depends(get_session)
):
    db_supplier = FiberSupplier.model_validate(supplier)
    session.add(db_supplier)
    await session.commit()
    await session.refresh(db_supplier)
    return db_supplier


@router.get("/fiber", response_model=List[FiberSupplier])
async def read_fiber_suppliers(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    query = select(FiberSupplier).offset(skip).limit(limit)
    result = await session.execute(query)
    suppliers = result.scalars().all()
    return suppliers












