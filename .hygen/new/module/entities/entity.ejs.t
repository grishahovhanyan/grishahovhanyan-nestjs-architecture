---
to: "src/modules/<%= h.moduleFolderName(name) %>/<%= h.entitiesFolderName(name) %>/<%= h.entityFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !resources.includes('Entity') %>
---
<%
  EntityName = h.EntityName(name)

  TableName = h.TableName(name)

%>import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('<%= TableName  %>')
export class <%= EntityName  %> {
  @PrimaryGeneratedColumn()
  id: number
}
