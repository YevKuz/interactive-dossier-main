## Application structure
- Keep bilingual editorial copy in a browser-safe shared module so both languages share the same page structure and interactions.
- Keep the personal dossier at the index route, with local React state for language and perspective selection; these interactions do not need persistent visitor data.
- Import conceptual images as bundled assets and use CDN asset pointers for downloadable CV documents to keep binary PDFs outside the repository.
