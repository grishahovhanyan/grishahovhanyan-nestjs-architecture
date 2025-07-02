---
to: "src/modules/<%= h.moduleFolderName(name) %>/<%= h.dtosFolderName(name) %>/index.ts"
unless_exists: true
---
<%
  createDtoFileName = h.createDtoFileName(name)
  getDtoFileName = h.getDtoFileName(name)
  responseDtoFileName = h.responseDtoFileName(name)
  updateDtoFileName = h.updateDtoFileName(name)

%>export * from './<%= createDtoFileName %>'
export * from './<%= getDtoFileName %>'
export * from './<%= responseDtoFileName %>'
export * from './<%= updateDtoFileName %>'
