from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import json


class MaterialType(str, Enum):
    FIBER = "fiber"
    RESIN = "resin"
    MATRIX = "matrix"


class GrapheneType(str, Enum):
    GRAPHENE_OXIDE = "graphene_oxide"
    REDUCED_GO = "reduced_go"
    PRISITNE_GRAPHENE = "pristine_graphene"
    FUNCTIONALIZED = "functionalized"


class ManufacturingMethod(str, Enum):
    HAND_LAYUP = "hand_layup"
    VACUUM_BAGGING = "vacuum_bagging"
    AUTOCLAVE = "autoclave"
    RTM = "rtm"
    FILAMENT_WINDING = "filament_winding"
    COMPRESSION_MOLDING = "compression_molding"


# Supplier Models
class GrapheneSupplierBase(SQLModel):
    name: str
    country: str = "Canada"
    contact: Optional[str] = None
    product_types: Optional[str] = None  # JSON string or comma-separated
    notes: Optional[str] = None


class GrapheneSupplier(GrapheneSupplierBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    graphene_specs: List["GrapheneSpec"] = Relationship(back_populates="supplier")


class FiberSupplierBase(SQLModel):
    name: str
    country: str = "Canada"
    contact: Optional[str] = None
    fiber_types: Optional[str] = None
    notes: Optional[str] = None


class FiberSupplier(FiberSupplierBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


# Material Model
class MaterialBase(SQLModel):
    name: str
    supplier_id: Optional[int] = Field(default=None, foreign_key="fibersupplier.id")
    type: MaterialType
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


class Material(MaterialBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    composite_runs: List["CompositeRun"] = Relationship(back_populates="base_material")


# Graphene Specs
class GrapheneSpecBase(SQLModel):
    name: str
    supplier_id: Optional[int] = Field(default=None, foreign_key="graphenesupplier.id")
    graphene_type: GrapheneType
    lateral_size_um: Optional[float] = None
    thickness_nm: Optional[float] = None
    layers: Optional[int] = None
    surface_area_m2_g: Optional[float] = None
    oxygen_pct: Optional[float] = None
    functionalization: Optional[str] = None
    typical_particle_size_nm: Optional[float] = None
    sheet_resistance_Ohm_sq: Optional[float] = None
    notes: Optional[str] = None


class GrapheneSpec(GrapheneSpecBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    supplier: Optional[GrapheneSupplier] = Relationship(back_populates="graphene_specs")
    composite_runs: List["CompositeRun"] = Relationship(back_populates="graphene_spec")


# Composite Runs
class CompositeRunBase(SQLModel):
    base_material_id: int = Field(foreign_key="material.id")
    matrix_material_id: Optional[int] = Field(default=None, foreign_key="material.id")
    graphene_spec_id: Optional[int] = Field(default=None, foreign_key="graphenespec.id")
    graphene_wt_pct: float = 0.0
    dispersion_quality: float = 0.5  # 0-1
    bonding_score: float = 0.5  # 0-1
    manufacturing_method: Optional[ManufacturingMethod] = None
    cure_temp_C: Optional[float] = None
    cure_pressure_bar: Optional[float] = None
    void_fraction: Optional[float] = None
    sample_thickness_mm: Optional[float] = None
    notes: Optional[str] = None


class CompositeRun(CompositeRunBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    base_material: Optional[Material] = Relationship(back_populates="composite_runs")
    graphene_spec: Optional[GrapheneSpec] = Relationship(back_populates="composite_runs")
    predictions: List["Prediction"] = Relationship(back_populates="run")


# Predictions
class PredictionBase(SQLModel):
    run_id: int = Field(foreign_key="compositerun.id")
    predicted_tensile_MPa: Optional[float] = None
    predicted_modulus_GPa: Optional[float] = None
    predicted_toughness_J: Optional[float] = None
    predicted_conductivity_S_m: Optional[float] = None
    predicted_ballistic_score: Optional[float] = None
    warnings_json: Optional[str] = None  # JSON string of warnings


class Prediction(PredictionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    run: Optional[CompositeRun] = Relationship(back_populates="predictions")


# Formula Model
class FormulaBase(SQLModel):
    property_name: str
    formula_expression: str  # e.g., "E_m * V_m + E_g * V_g"
    variables: str  # JSON string list of variable names
    description: Optional[str] = None
    unit: Optional[str] = None


class Formula(FormulaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)










