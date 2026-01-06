"""
Seed database with initial Canadian suppliers and common materials.
"""
import asyncio
from sqlmodel import SQLModel, create_engine, Session
from app.models import (
    GrapheneSupplier, FiberSupplier, Material, MaterialType,
    GrapheneSpec, GrapheneType
)

# Create sync engine for seeding
engine = create_engine("sqlite:///./graphene_composite.db", echo=True)


def seed_database():
    with Session(engine) as session:
        # Create tables
        SQLModel.metadata.create_all(engine)
        
        # Graphene Suppliers (Canadian)
        graphene_suppliers = [
            GrapheneSupplier(
                name="Graphene Leaders Canada",
                country="Canada",
                contact="info@grapheneleaders.ca",
                product_types="graphene_oxide,reduced_go,pristine_graphene",
                notes="Based in Toronto, ships across Canada"
            ),
            GrapheneSupplier(
                name="NanoXplore Inc.",
                country="Canada",
                contact="sales@nanoxplore.ca",
                product_types="pristine_graphene,functionalized",
                notes="Montreal-based, large-scale production"
            ),
            GrapheneSupplier(
                name="Graphene Solutions",
                country="Canada",
                contact="contact@graphenesolutions.ca",
                product_types="graphene_oxide,reduced_go",
                notes="Vancouver-based supplier"
            )
        ]
        
        for supplier in graphene_suppliers:
            session.add(supplier)
        
        # Fiber Suppliers (Canadian)
        fiber_suppliers = [
            FiberSupplier(
                name="Hexcel Canada",
                country="Canada",
                contact="canada@hexcel.com",
                fiber_types="carbon_fiber,aramid,glass",
                notes="Major composite materials supplier"
            ),
            FiberSupplier(
                name="Toray Advanced Composites",
                country="Canada",
                contact="info@toraytac.com",
                fiber_types="carbon_fiber,prepreg",
                notes="Advanced composite materials"
            )
        ]
        
        for supplier in fiber_suppliers:
            session.add(supplier)
        
        session.commit()
        
        # Common Base Materials
        materials = [
            Material(
                name="Kevlar 49",
                type=MaterialType.FIBER,
                density_g_cm3=1.44,
                tensile_MPa=3620.0,
                youngs_GPa=112.0,
                elongation_pct=2.5,
                toughness_Jm3=9.05e6,
                thermal_conductivity_W_mK=0.04,
                electrical_conductivity_S_m=1e-12
            ),
            Material(
                name="Carbon Fiber T300",
                type=MaterialType.FIBER,
                density_g_cm3=1.76,
                tensile_MPa=3530.0,
                youngs_GPa=230.0,
                elongation_pct=1.5,
                thermal_conductivity_W_mK=8.0,
                electrical_conductivity_S_m=1e4
            ),
            Material(
                name="Epoxy Resin EPON 828",
                type=MaterialType.RESIN,
                density_g_cm3=1.16,
                tensile_MPa=75.0,
                youngs_GPa=3.0,
                elongation_pct=5.0,
                thermal_conductivity_W_mK=0.2,
                electrical_conductivity_S_m=1e-14
            )
        ]
        
        for material in materials:
            session.add(material)
        
        session.commit()
        
        # Graphene Specs
        graphene_specs = [
            GrapheneSpec(
                name="GO Standard",
                supplier_id=1,
                graphene_type=GrapheneType.GRAPHENE_OXIDE,
                lateral_size_um=5.0,
                thickness_nm=1.0,
                layers=1,
                surface_area_m2_g=2630.0,
                oxygen_pct=30.0,
                sheet_resistance_Ohm_sq=1e6
            ),
            GrapheneSpec(
                name="rGO High Quality",
                supplier_id=1,
                graphene_type=GrapheneType.REDUCED_GO,
                lateral_size_um=10.0,
                thickness_nm=0.8,
                layers=1,
                surface_area_m2_g=2000.0,
                oxygen_pct=5.0,
                sheet_resistance_Ohm_sq=100.0
            )
        ]
        
        for spec in graphene_specs:
            session.add(spec)
        
        session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()












