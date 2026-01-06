from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_session
from app.models import Formula, FormulaBase

router = APIRouter(prefix="/api/formulas", tags=["formulas"])


class FormulaUpdate(BaseModel):
    property_name: Optional[str] = None
    formula_expression: Optional[str] = None
    variables: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None


@router.post("/", response_model=Formula, status_code=status.HTTP_201_CREATED)
async def create_formula(
    formula: FormulaBase,
    session: AsyncSession = Depends(get_session)
):
    db_formula = Formula.model_validate(formula)
    session.add(db_formula)
    await session.commit()
    await session.refresh(db_formula)
    return db_formula


@router.get("/", response_model=List[Formula])
async def read_formulas(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    query = select(Formula).offset(skip).limit(limit)
    result = await session.execute(query)
    formulas = result.scalars().all()
    return formulas


@router.get("/{formula_id}", response_model=Formula)
async def read_formula(
    formula_id: int,
    session: AsyncSession = Depends(get_session)
):
    formula = await session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(status_code=404, detail="Formula not found")
    return formula


@router.patch("/{formula_id}", response_model=Formula)
async def update_formula(
    formula_id: int,
    formula_data: FormulaUpdate,
    session: AsyncSession = Depends(get_session)
):
    formula = await session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(status_code=404, detail="Formula not found")
    
    update_data = formula_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(formula, key, value)
    
    formula.updated_at = datetime.now()
    session.add(formula)
    await session.commit()
    await session.refresh(formula)
    return formula


@router.delete("/{formula_id}")
async def delete_formula(
    formula_id: int,
    session: AsyncSession = Depends(get_session)
):
    formula = await session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(status_code=404, detail="Formula not found")
    
    await session.delete(formula)
    await session.commit()
    return {"ok": True}












