import numpy as np
import pandas as pd

from qiskit_optimization import QuadraticProgram
from qiskit_optimization.algorithms import MinimumEigenOptimizer

# 1. Import QAOA and COBYLA
from qiskit_algorithms.minimum_eigensolvers import QAOA
from qiskit_algorithms.optimizers import COBYLA

# 2. Import the NATIVE Qiskit Sampler (Compatible with Qiskit 1.0+)
# We avoid 'qiskit_aer' here to stop the version conflicts.
from qiskit.primitives import StatevectorSampler

def run_quantum_optimization(
    risk_df: pd.DataFrame,
    max_assets: int = 5,
    risk_factor: float = 0.6
):
    symbols = risk_df["symbol"].tolist()
    n = len(symbols)

    qp = QuadraticProgram()

    # Binary variables (Buy or Don't Buy)
    for i in range(n):
        qp.binary_var(name=f"x{i}")

    confidence_penalty = {
        "HIGH": 0.0,
        "MEDIUM": 0.2,
        "LOW": 0.5
    }

    linear = {}
    quadratic = {}

    # Define the "Energy" function (Risk vs Return)
    for i in range(n):
        cvar = abs(risk_df.loc[i, "cvar_5pct"])
        illiq = risk_df.loc[i, "amihud_illiquidity"]
        conf = confidence_penalty.get(risk_df.loc[i, "confidence_tier"], 1.0)

        linear[f"x{i}"] = cvar + illiq + conf

        for j in range(n):
            if i != j:
                quadratic[(f"x{i}", f"x{j}")] = risk_factor

    qp.minimize(linear=linear, quadratic=quadratic)

   # Constraint: Select exactly 'max_assets'
    qp.linear_constraint(
        linear={f"x{i}": 1 for i in range(n)},
        sense="==",  # <--- FIXED (Must be exactly)
        rhs=max_assets,
        name="max_assets"
    )

    # 3. Initialize the Native Sampler
    # This works out-of-the-box with Qiskit Algorithms (both use V2 primitives)
    sampler = StatevectorSampler()
    
    # 4. Pass 'sampler' (NOT estimator) and the optimizer
    qaoa = QAOA(sampler=sampler, optimizer=COBYLA(), reps=2)
    
    optimizer = MinimumEigenOptimizer(qaoa)

    result = optimizer.solve(qp)

    solution = np.array(result.x)
    selected = [symbols[i] for i in range(n) if solution[i] == 1]

    return {
        "selected_stocks": selected,
        "binary_solution": solution.tolist(),
        "num_selected": int(solution.sum())
    }