from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_session
from app.models import CompositeRun, CompositeRunBase, ManufacturingMethod

router = APIRouter(prefix="/api/runs", tags=["runs"])


class CompositeRunUpdate(BaseModel):
    base_material_id: Optional[int] = None
    matrix_material_id: Optional[int] = None
    graphene_spec_id: Optional[int] = None
    graphene_wt_pct: Optional[float] = None
    dispersion_quality: Optional[float] = None
    bonding_score: Optional[float] = None
    manufacturing_method: Optional[ManufacturingMethod] = None
    cure_temp_C: Optional[float] = None
    cure_pressure_bar: Optional[float] = None
    void_fraction: Optional[float] = None
    sample_thickness_mm: Optional[float] = None
    notes: Optional[str] = None


@router.post("/", response_model=CompositeRun, status_code=status.HTTP_201_CREATED)
async def create_run(
    run: CompositeRunBase,
    session: AsyncSession = Depends(get_session)
):
    db_run = CompositeRun.model_validate(run)
    session.add(db_run)
    await session.commit()
    await session.refresh(db_run)
    return db_run


@router.get("/", response_model=List[CompositeRun])
async def read_runs(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    query = select(CompositeRun).offset(skip).limit(limit).order_by(CompositeRun.created_at.desc())
    result = await session.execute(query)
    runs = result.scalars().all()
    return runs


@router.get("/{run_id}", response_model=CompositeRun)
async def read_run(
    run_id: int,
    session: AsyncSession = Depends(get_session)
):
    run = await session.get(CompositeRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@router.patch("/{run_id}", response_model=CompositeRun)
async def update_run(
    run_id: int,
    run_data: CompositeRunUpdate,
    session: AsyncSession = Depends(get_session)
):
    run = await session.get(CompositeRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    update_data = run_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(run, key, value)
    
    session.add(run)
    await session.commit()
    await session.refresh(run)
    return run


@router.delete("/{run_id}")
async def delete_run(
    run_id: int,
    session: AsyncSession = Depends(get_session)
):
    run = await session.get(CompositeRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    await session.delete(run)
    await session.commit()
    return {"ok": True}












