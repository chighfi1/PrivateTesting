# Copilot Angular Generator

## Scenario
[DESCRIPTION]  
(*I will describe the scenario in the ask box each time.*)

---

## Instructions for Copilot
Based on the scenario provided:

1. **Invent Names**
   - Derive a concise Angular-style component name from the scenario.  
   - Create a kebab-case route path from the component name.  
   - If the scenario implies external logic or data access, also invent a clear Angular service name.  

2. **Generate Files**
   - `[COMPONENT].component.ts`
   - `[COMPONENT].component.html`
   - `[COMPONENT].component.css`
   - `[SERVICE].service.ts` (only if the scenario warrants one)  

3. **Wire Up**
   - Update `app-routing.module.ts` with the new route.  
   - If a service is created, inject it into the component.  

4. **Implementation**
   - **Constructor:** Implement business logic with exactly two conditions (if/else style).  
     - If a service exists, base this logic on data/methods from the service.  
     - If no service is needed, implement the logic directly in the constructor.  
   - **ngOnInit:** Add a simple piece of business logic (formatting, calculation, or initialization).  
   - **Service (optional):** If present, return mocked/stub data or simple business methods.  
   - **Template:** Display output from the constructor and/or `ngOnInit` logic in a way that makes sense.  

---

## Important
- **Apply all edits directly to the workspace** (create new files and update existing ones).  
- **Do not only show diffs, summaries, or previews.**  
- When multiple files are involved, provide an **Apply All** option so I can accept everything in one action.  
- Ensure all names and logic semantically match the scenario.  