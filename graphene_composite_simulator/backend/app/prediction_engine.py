"""
Physics-based prediction engine for graphene composite properties.
Implements Rule of Mixtures, Halpin-Tsai, and other composite mechanics models.
"""
import math
from typing import Dict, Any, Optional, List
from sympy import symbols, sympify, lambdify


def weight_to_volume_fraction(
    weight_pct: float,
    density_base: float,
    density_graphene: float = 2.2  # Typical graphene density g/cm³
) -> float:
    """
    Convert weight percentage to volume fraction.
    
    V_g = (W_g / ρ_g) / ((W_g / ρ_g) + ((100 - W_g) / ρ_m))
    """
    if weight_pct <= 0 or weight_pct >= 100:
        return 0.0
    
    w_g = weight_pct / 100.0
    w_m = 1.0 - w_g
    
    v_g = (w_g / density_graphene) / ((w_g / density_graphene) + (w_m / density_base))
    return v_g


def rule_of_mixtures(
    property_matrix: float,
    property_graphene: float,
    volume_fraction: float
) -> float:
    """
    Simple rule of mixtures: P_c = P_m * V_m + P_g * V_g
    """
    volume_matrix = 1.0 - volume_fraction
    return property_matrix * volume_matrix + property_graphene * volume_fraction


def halpin_tsai_modulus(
    E_m: float,  # Matrix modulus
    E_g: float,  # Graphene modulus (~1000 GPa)
    V_g: float,  # Volume fraction
    aspect_ratio: float = 1000.0,  # Typical graphene aspect ratio
    orientation_factor: float = 0.375  # Random orientation
) -> float:
    """
    Halpin-Tsai model for modulus prediction.
    Accounts for aspect ratio and orientation.
    """
    if V_g <= 0:
        return E_m
    
    eta = ((E_g / E_m) - 1) / ((E_g / E_m) + 2 * aspect_ratio)
    E_c = E_m * (1 + 2 * aspect_ratio * eta * V_g) / (1 - eta * V_g)
    
    # Apply orientation factor for random orientation
    return E_c * orientation_factor + E_m * (1 - orientation_factor)


def predict_tensile_strength(
    base_tensile: float,
    graphene_tensile: float = 130000.0,  # MPa (theoretical)
    volume_fraction: float = 0.0,
    dispersion_quality: float = 0.5,
    bonding_score: float = 0.5,
    void_fraction: float = 0.0
) -> float:
    """
    Predict tensile strength considering dispersion and bonding.
    """
    # Base rule of mixtures
    strength = rule_of_mixtures(base_tensile, graphene_tensile, volume_fraction)
    
    # Apply efficiency factors
    efficiency = dispersion_quality * bonding_score
    strength *= efficiency
    
    # Reduce for voids
    strength *= (1.0 - void_fraction)
    
    return max(strength, base_tensile * 0.5)  # Minimum 50% of base


def predict_thermal_conductivity(
    base_conductivity: float,
    graphene_conductivity: float = 5000.0,  # W/mK (in-plane)
    volume_fraction: float = 0.0,
    dispersion_quality: float = 0.5
) -> float:
    """
    Predict thermal conductivity.
    """
    # Effective medium approximation
    k_c = base_conductivity * (1 + 2 * volume_fraction * (graphene_conductivity - base_conductivity) / 
                              (graphene_conductivity + 2 * base_conductivity))
    
    # Apply dispersion efficiency
    k_c = base_conductivity + (k_c - base_conductivity) * dispersion_quality
    
    return k_c


def predict_electrical_conductivity(
    base_conductivity: float,
    graphene_conductivity: float = 1e8,  # S/m
    volume_fraction: float = 0.0,
    percolation_threshold: float = 0.01  # Typical percolation threshold
) -> float:
    """
    Predict electrical conductivity with percolation threshold.
    """
    if volume_fraction < percolation_threshold:
        return base_conductivity
    
    # Power law near percolation
    t = 1.5  # Critical exponent
    sigma_c = base_conductivity * ((volume_fraction - percolation_threshold) / 
                                   (1 - percolation_threshold)) ** t
    
    # Add graphene contribution
    sigma_c += graphene_conductivity * volume_fraction
    
    return sigma_c


def predict_toughness(
    base_toughness: float,
    volume_fraction: float = 0.0,
    dispersion_quality: float = 0.5,
    bonding_score: float = 0.5
) -> float:
    """
    Predict toughness (energy absorption).
    """
    # Toughness can increase with good dispersion but decrease with poor bonding
    toughness_factor = 1.0 + (dispersion_quality * 0.5) - ((1.0 - bonding_score) * 0.3)
    toughness = base_toughness * toughness_factor * (1.0 + volume_fraction * 0.2)
    
    return max(toughness, base_toughness * 0.7)


def generate_warnings(
    volume_fraction: float,
    dispersion_quality: float,
    bonding_score: float,
    void_fraction: Optional[float] = None
) -> List[str]:
    """
    Generate warnings based on input parameters.
    """
    warnings = []
    
    if volume_fraction > 0.05:
        warnings.append("High graphene content may cause agglomeration")
    
    if dispersion_quality < 0.3:
        warnings.append("Low dispersion quality - risk of agglomeration")
    
    if bonding_score < 0.3:
        warnings.append("Poor bonding - may reduce mechanical properties")
    
    if void_fraction and void_fraction > 0.05:
        warnings.append("High void fraction - may reduce strength significantly")
    
    if volume_fraction > 0.1:
        warnings.append("Very high graphene content - processing may be difficult")
    
    return warnings


def evaluate_formula(
    formula_expression: str,
    variables: Dict[str, float]
) -> float:
    """
    Evaluate a mathematical formula using sympy.
    
    Args:
        formula_expression: String like "E_m * V_m + E_g * V_g"
        variables: Dictionary of variable names to values
    
    Returns:
        Calculated result
    """
    try:
        # Create symbols for all variables
        sym_vars = symbols(list(variables.keys()))
        
        # Parse and evaluate
        expr = sympify(formula_expression)
        func = lambdify(sym_vars, expr, "numpy")
        
        # Get values in same order as symbols
        values = [variables[str(v)] for v in sym_vars]
        
        result = func(*values)
        return float(result) if result is not None else 0.0
    except Exception as e:
        print(f"Formula evaluation error: {e}")
        return 0.0












