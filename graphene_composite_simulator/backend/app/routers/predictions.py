from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel
import json

from app.database import get_session
from app.models import Prediction, PredictionBase, CompositeRun, Material, GrapheneSpec
from app.prediction_engine import (
    weight_to_volume_fraction,
    predict_tensile_strength,
    predict_thermal_conductivity,
    predict_electrical_conductivity,
    predict_toughness,
    halpin_tsai_modulus,
    generate_warnings
)

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.post("/calculate/{run_id}", response_model=Prediction)
async def calculate_predictions(
    run_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Calculate predictions for a composite run.
    """
    run = await session.get(CompositeRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    # Get base material properties
    base_material = await session.get(Material, run.base_material_id)
    if not base_material:
        raise HTTPException(status_code=404, detail="Base material not found")
    
    # Get graphene spec if provided
    graphene_spec = None
    if run.graphene_spec_id:
        graphene_spec = await session.get(GrapheneSpec, run.graphene_spec_id)
    
    # Convert weight % to volume fraction
    base_density = base_material.density_g_cm3 or 1.5  # Default
    volume_fraction = weight_to_volume_fraction(
        run.graphene_wt_pct,
        base_density
    )
    
    # Predict properties
    predicted_tensile = predict_tensile_strength(
        base_material.tensile_MPa or 100.0,
        volume_fraction=volume_fraction,
        dispersion_quality=run.dispersion_quality,
        bonding_score=run.bonding_score,
        void_fraction=run.void_fraction or 0.0
    )
    
    predicted_modulus = halpin_tsai_modulus(
        base_material.youngs_GPa or 3.0,
        E_g=1000.0,  # Graphene modulus
        V_g=volume_fraction
    )
    
    predicted_toughness = predict_toughness(
        base_material.toughness_Jm3 or 1000.0,
        volume_fraction=volume_fraction,
        dispersion_quality=run.dispersion_quality,
        bonding_score=run.bonding_score
    )
    
    predicted_conductivity = predict_electrical_conductivity(
        base_material.electrical_conductivity_S_m or 1e-10,
        volume_fraction=volume_fraction
    )
    
    # Generate warnings
    warnings = generate_warnings(
        volume_fraction,
        run.dispersion_quality,
        run.bonding_score,
        run.void_fraction
    )
    
    # Create or update prediction
    existing = await session.execute(
        select(Prediction).where(Prediction.run_id == run_id)
    )
    prediction = existing.scalar_one_or_none()
    
    if prediction:
        prediction.predicted_tensile_MPa = predicted_tensile
        prediction.predicted_modulus_GPa = predicted_modulus
        prediction.predicted_toughness_J = predicted_toughness
        prediction.predicted_conductivity_S_m = predicted_conductivity
        prediction.warnings_json = json.dumps(warnings)
    else:
        prediction = Prediction(
            run_id=run_id,
            predicted_tensile_MPa=predicted_tensile,
            predicted_modulus_GPa=predicted_modulus,
            predicted_toughness_J=predicted_toughness,
            predicted_conductivity_S_m=predicted_conductivity,
            warnings_json=json.dumps(warnings)
        )
        session.add(prediction)
    
    await session.commit()
    await session.refresh(prediction)
    return prediction


@router.get("/run/{run_id}", response_model=Prediction)
async def get_prediction_for_run(
    run_id: int,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Prediction).where(Prediction.run_id == run_id)
    )
    prediction = result.scalar_one_or_none()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction












