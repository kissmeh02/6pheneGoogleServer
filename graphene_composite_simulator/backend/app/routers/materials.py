from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_session
from app.models import Material, MaterialBase, MaterialType, GrapheneSpec, GrapheneSpecBase, GrapheneType

router = APIRouter(prefix="/api/materials", tags=["materials"])


class MaterialUpdate(BaseModel):
    name: Optional[str] = None
    supplier_id: Optional[int] = None
    type: Optional[MaterialType] = None
    density_g_cm3: Optional[float] = None
    tensile_MPa: Optional[float] = None
    youngs_GPa: Optional[float] = None
    elongation_pct: Optional[float] = None
    toughness_Jm3: Optional[float] = None
    impact_kJ_m2: Optional[float] = None
    thermal_conductivity_W_mK: Optional[float] = None
    specific_heat_J_kgK: Optional[float] = None
    expansion_ppm_K: Optional[float] = None
    electrical_conductivity_S_m: Optional[float] = None
    resistivity_Ohm_m: Optional[float] = None
    dielectric_const: Optional[float] = None
    orientation: Optional[str] = None
    volume_fraction_pct: Optional[float] = None
    layup_type: Optional[str] = None
    notes: Optional[str] = None


@router.post("/", response_model=Material, status_code=status.HTTP_201_CREATED)
async def create_material(
    material: MaterialBase,
    session: AsyncSession = Depends(get_session)
):
    db_material = Material.model_validate(material)
    session.add(db_material)
    await session.commit()
    await session.refresh(db_material)
    return db_material


@router.get("/", response_model=List[Material])
async def read_materials(
    skip: int = 0,
    limit: int = 100,
    material_type: Optional[MaterialType] = None,
    session: AsyncSession = Depends(get_session)
):
    query = select(Material)
    if material_type:
        query = query.where(Material.type == material_type)
    query = query.offset(skip).limit(limit)
    
    result = await session.execute(query)
    materials = result.scalars().all()
    return materials


@router.get("/{material_id}", response_model=Material)
async def read_material(
    material_id: int,
    session: AsyncSession = Depends(get_session)
):
    material = await session.get(Material, material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material


@router.patch("/{material_id}", response_model=Material)
async def update_material(
    material_id: int,
    material_data: MaterialUpdate,
    session: AsyncSession = Depends(get_session)
):
    material = await session.get(Material, material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    update_data = material_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(material, key, value)
    
    session.add(material)
    await session.commit()
    await session.refresh(material)
    return material


@router.delete("/{material_id}")
async def delete_material(
    material_id: int,
    session: AsyncSession = Depends(get_session)
):
    material = await session.get(Material, material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    await session.delete(material)
    await session.commit()
    return {"ok": True}


# Graphene Specs endpoints
@router.post("/graphene-specs", response_model=GrapheneSpec, status_code=status.HTTP_201_CREATED)
async def create_graphene_spec(
    spec: GrapheneSpecBase,
    session: AsyncSession = Depends(get_session)
):
    db_spec = GrapheneSpec.model_validate(spec)
    session.add(db_spec)
    await session.commit()
    await session.refresh(db_spec)
    return db_spec


@router.get("/graphene-specs", response_model=List[GrapheneSpec])
async def read_graphene_specs(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    query = select(GrapheneSpec).offset(skip).limit(limit)
    result = await session.execute(query)
    specs = result.scalars().all()
    return specs


@router.get("/graphene-specs/{spec_id}", response_model=GrapheneSpec)
async def read_graphene_spec(
    spec_id: int,
    session: AsyncSession = Depends(get_session)
):
    spec = await session.get(GrapheneSpec, spec_id)
    if not spec:
        raise HTTPException(status_code=404, detail="Graphene spec not found")
    return spec










