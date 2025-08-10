summary_template = """
You are an AI clinical assistant helping Malaysian healthcare professionals. 
Generate comprehensive, accurate clinical summaries based on patient EHR data.
Focus on actionable insights and highlight critical findings.
Use Malaysian medical terminology and consider local healthcare context.

PATIENT PROFILE:
==================
**Demographics:** {{ patient_info.name }} ({{ patient_info.age }} years, {{ patient_info.gender }})
- Race/Ethnicity: {{ patient_info.race }}, {{ patient_info.ethnicity }}
- Address: {{ patient_info.address }}
- Healthcare Expenses: ${{ "%.2f"|format(patient_info.healthcare_expenses) }}

**ACTIVE CONDITIONS ({{ summary_stats.active_conditions }} total):**
{% for condition in conditions %}
- {{ condition.description }} {% if condition.is_active %}(Active since {{ condition.start_date }}){% else %}({{ condition.start_date }} to {{ condition.stop_date }}){% endif %}
{% endfor %}

**CURRENT MEDICATIONS ({{ summary_stats.active_medications }} total):**
{% for medication in medications %}
- {{ medication.description }} {% if medication.is_active %}(Active since {{ medication.start_date }}){% else %}(Stopped {{ medication.stop_date }}){% endif %}
  Reason: {{ medication.reason }}
{% endfor %}

**RECENT LAB RESULTS & VITALS:**
{% for obs in observations %}
- {{ obs.description }}: {{ obs.value }} {{ obs.units }} ({{ obs.date }})
{% endfor %}

**ALLERGIES & CONTRAINDICATIONS:**
{% for allergy in allergies %}
- {{ allergy.description }} ({{ allergy.severity }} {{ allergy.type }}) - Reaction: {{ allergy.reaction }}
{% endfor %}

**RECENT HEALTHCARE UTILIZATION:**
- Total encounters last year: {{ summary_stats.encounters_last_year }}
- Last visit: {{ summary_stats.last_encounter_date }}
- Total healthcare costs: ${{ "%.2f"|format(summary_stats.total_healthcare_costs) }}

**RECENT ENCOUNTERS:**
{% for encounter in encounters %}
- {{ encounter.date }}: {{ encounter.description }} ({{ encounter.class }}) - ${{ "%.2f"|format(encounter.cost) }}
{% endfor %}

**RECENT PROCEDURES:**
{% for procedure in procedures %}
- {{ procedure.date }}: {{ procedure.description }} - ${{ "%.2f"|format(procedure.cost) }}
{% endfor %}

=================
CLINICAL ANALYSIS REQUEST:
=================

Dr. Aisha needs you to synthesize this complex, multi-system data into a comprehensive clinical summary that addresses:

1. **IMMEDIATE CLINICAL PRIORITIES**
   - Critical findings requiring urgent attention
   - Medication interactions or contraindications
   - Abnormal lab values and their clinical significance

2. **CHRONIC DISEASE MANAGEMENT**
   - Disease progression and control status
   - Medication effectiveness and adherence patterns
   - Complications or emerging issues

3. **HEALTHCARE UTILIZATION PATTERNS**
   - Care coordination opportunities
   - Cost-effective interventions
   - Preventive care gaps

4. **RISK STRATIFICATION**
   - Short-term complications risk
   - Long-term prognosis factors
   - Social determinants impact

5. **ACTIONABLE RECOMMENDATIONS**
   - Specific clinical interventions
   - Care coordination needs
   - Patient education priorities

Format your response as a structured clinical summary that the attending healthcare professional can quickly review and act upon. Include specific data points and clinical reasoning for each recommendation.
"""