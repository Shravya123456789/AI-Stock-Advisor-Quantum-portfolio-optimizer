import streamlit as st
import pandas as pd
import requests # <--- NEW: Required to talk to your API
import random

# =====================================================
# PAGE CONFIG
# =====================================================
st.set_page_config(
    page_title="FinNet | Investment Analytics Platform",
    layout="wide"
)

# =====================================================
# GLOBAL FINANCE UI THEME (CLEAN & WHITE)
# =====================================================
st.markdown("""
<style>
/* ---------- BASE ---------- */
html, body, .stApp {
    background-color: #ffffff;
    color: #0f172a;
    font-family: 'Segoe UI', 'Inter', sans-serif;
}
/* ---------- REMOVE STREAMLIT BRAND ---------- */
header, footer { visibility: hidden; }

/* ---------- TOP TITLE ---------- */
.app-title { font-size: 2.4rem; font-weight: 700; margin-bottom: 0.2rem; }
.app-subtitle { font-size: 1rem; color: #475569; margin-bottom: 1.5rem; }

/* ---------- KPI CARDS ---------- */
.kpi {
    background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 14px; padding: 20px; text-align: center;
}
.kpi h2 { margin: 0; font-size: 1.4rem; }
.kpi span { color: #64748b; font-size: 0.9rem; }

/* ---------- SECTION CARD ---------- */
.section {
    background: #ffffff; border: 1px solid #e5e7eb;
    border-radius: 16px; padding: 28px; margin-bottom: 24px;
}
</style>
""", unsafe_allow_html=True)

# =====================================================
# HEADER
# =====================================================
st.markdown('<div class="app-title">FinNet</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="app-subtitle">Institutional Investment Analysis & Quantum Portfolio Optimization</div>',
    unsafe_allow_html=True
)

# =====================================================
# TABS
# =====================================================
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "🔍 Stock Overview", "📊 Fundamentals", "📈 Technicals", "🔮 Prediction", "⚛️ Quantum Portfolio"
])

# ... [TABS 1-4 REMAIN THE SAME AS YOUR ORIGINAL CODE] ...

# =====================================================
# TAB 5 — QUANTUM PORTFOLIO (THE INTEGRATION)
# =====================================================
with tab5:
    st.markdown('<div class="section">', unsafe_allow_html=True)
    st.subheader("Quantum Portfolio Optimization")
    
    st.write("Select stocks to build your universe. The Quantum Engine will identify the optimal subset.")

    # 1. User Inputs
    # -------------------------------------------------
    universe = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "BHARTIARTL", "ITC"]
    selected_tickers = st.multiselect("Select Assets (Min 3):", universe, default=universe[:5])
    
    max_assets = st.slider("Target Portfolio Size (How many stocks to pick?):", min_value=2, max_value=len(selected_tickers), value=3)

    # 2. Prepare Payload (Simulating Financial Data for Demo)
    # -------------------------------------------------
    # In a real app, you would fetch this from a database. 
    # Here we mock it so the API receives valid floats.
    cvar_data = [random.uniform(-0.05, -0.02) for _ in selected_tickers]
    illiq_data = [random.uniform(0.01, 0.05) for _ in selected_tickers]
    conf_data = ["HIGH" for _ in selected_tickers]

    # 3. The "Run" Button
    # -------------------------------------------------
    if st.button("🚀 Run Quantum Optimization"):
        if len(selected_tickers) < 3:
            st.error("Please select at least 3 stocks.")
        else:
            with st.spinner("Initializing Quantum Circuit (QAOA)..."):
                try:
                    # --- THE API CALL ---
                    payload = {
                        "symbols": selected_tickers,
                        "cvar_5pct": cvar_data,
                        "amihud_illiquidity": illiq_data,
                        "confidence_tier": conf_data,
                        "max_assets": max_assets
                    }
                    
                    # Sending data to your FastAPI backend
                    response = requests.post("http://127.0.0.1:8000/quantum/optimize", json=payload)
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        # 4. Display Results
                        # -------------------------------------------------
                        st.success("Optimization Complete!")
                        
                        col1, col2 = st.columns(2)
                        with col1:
                            st.markdown("### 🏆 Optimal Portfolio")
                            for stock in data['selected_stocks']:
                                st.markdown(f"- **{stock}**")
                        
                        with col2:
                            st.metric(label="Total Assets Selected", value=data['num_selected'])
                            st.json(data) # Show raw JSON for debugging
                    else:
                        st.error(f"Error {response.status_code}: {response.text}")

                except requests.exceptions.ConnectionError:
                    st.error("❌ Connection Failed. Is your FastAPI backend running on port 8000?")
                except Exception as e:
                    st.error(f"An unexpected error occurred: {e}")

    st.markdown('</div>', unsafe_allow_html=True)